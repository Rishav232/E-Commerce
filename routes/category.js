const express = require("express");
const routes = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchID");
const isAdmin = require("../middleware/isAdmin");
const Category = require("../models/Category");
const slugify = require("slugify");
//create-category
routes.post("/create-category", [
  body("name", "Name is required").notEmpty()
], fetchUser, isAdmin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name } = req.body;
    const existingCategory = await Category.findOne({ name });

    if (existingCategory)
      return res.status(200).send({ success: "true", message: "Category already exists" });

    const newCategory = await Category.create({
      name,
      slug: slugify(name)
    })
    res.status(201).send({ success: true, message: "Category Created Successfully", newCategory })
  }
  catch (e) {
    console.log(e);
    res.status(404).send({ success: false, message: "Error Occurred" })
  }
})

routes.put("/update-category/:id", [
  body("name", "Name is required").notEmpty()
], fetchUser, isAdmin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name } = req.body;
    const { id } = req.params;
    const updateCategory = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
    res.status(200).send({ message: "Updated Successfully", updateCategory });
  }
  catch (e) {
    console.log(e);
    res.status(404).send({ success: false, message: "Error Occurred" })
  }
})
routes.get("/getAllcategory", async (req, res) => {

  const allCategory = await Category.find();
  res.status(200).send({ message: "All Categories", allCategory });//timeStamp:4:43:16
})
routes.get("/getSinglecategory/:slug", async (req, res) => {
  try {
    const category = await Category.find({ slug: req.params.slug });
    if(!category)
    return res.status(404).send({ message: "Category Not found" });
    res.status(200).send({ message: "Single Category", category });
  }
  catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: "Error Occurred " })
  }

})
routes.delete("/deleteCategory/:id", fetchUser, isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Deleted Successfully" });
  }
  catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: "Error Occurred while deleting " })
  }
})
module.exports = routes;