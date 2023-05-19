const express = require("express");
const User = require("../models/Auth");
const routes = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchID");
const isAdmin = require("../middleware/isAdmin");
const JWT_SECRET = process.env.JWT_SECRET||"thisismysecret";
const Order=require("../models/Order")
routes.post("/register", [
  body('name', "Name Should be atleast 5 characters").isLength({ min: 5 }),
  body("email", "Email is Required").isEmail(),
  body('password', "password Should be atleast 5 characters").isLength({ min: 5 }),
  body('phone', "Invalid Phone Number").isLength({ min: 10, max: 10 }),
  body('answer', "Answer must be atleast 3 characters").isLength({ min: 3 }),
  body('address', "Address Should be atleast 10 characters").isLength({ min: 10 })
], async (req, res) => {
  // console.log("Hello");
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(500).json({ success, errors: errors.array() });
  }
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(208).json({ success: false, errors: "Already Registered" });
  }
  const secPass = await bcrypt.hash(req.body.password, 10);


  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: secPass,
    address: req.body.address,
    phone: req.body.phone,
    answer: req.body.answer,
    role: req.body.role
  })
  const data = {
    user: {
      id: user.id
    }
  }
  const authToken = jwt.sign(data, JWT_SECRET);
  res.status(201).send({ success: true, message: "Succesfully Registered", authToken, user });

})

routes.post("/login", [
  body("email", "Email is Required").isEmail(),
  body('password', "Password cannot be blank").exists(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success, errors: "Invalid Credentails" });
  }
  const decode = await bcrypt.compare(password, user.password);
  if (!decode) {
    return res.status(400).json({ success, errors: "Please Try Again" });
  }
  const data = {
    user: {
      id: user.id
    }
  }
  const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "30d" });
  res.json({
    success: true, message: "Succesfully Logged In", authToken, user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address:user.address
    }
  });//this is done to create session for particular user so that he can stay logged in.

})
routes.post("/getuser", fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    // console.log(userId);
    const user = await User.findById(userId).select("-password");
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ errors: "Internal Server Error" });
  }
})
routes.get("/userAuth", fetchUser, (req, res) => {
  // console.log(JWT_SECRET);
  res.status(200).send({ ok: true });
})
routes.put("/forgot-password", [
  body("email", "Email is Required").isEmail(),
  body('answer', "Answer cannot be blank").exists(),
  body('newpassword', "newpassword cannot be blank").exists()
], async (req, res) => {
  const { email, answer, newpassword } = req.body;
  let user = await User.findOne({ email, answer });
  if (!user) {
    return res.status(500).json({ errors: "Invalid Email or Answer" })
  }
  const secPass = await bcrypt.hash(newpassword, 10);
  user = await User.findByIdAndUpdate(user._id, { $set: { password: secPass } }, { new: true });
  await user.save();
  res.json({ success: true, message: "Succesfully Reset the password" });
})
routes.get("/isAdmin", isAdmin, (req, res) => {
  try {
    res.status(200).send({ ok: true });
  }
  catch (e) {
    console.log(e);
  }
})
routes.put("/update-profile", [
  body('name', "Name Should be atleast 5 characters").isLength({ min: 5 }),
  body("email", "Email is Required").isEmail(),
  body('phone', "Invalid Phone Number").isLength({ min: 10, max: 10 }),
  body('address', "Address Should be atleast 10 characters").isLength({ min: 10 })
], fetchUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(500).json({ success: false, errors: errors.array() });
    }
    const { name, email, phone, address } = req.body;
    userId = req.user.id;
    const user = await User.findByIdAndUpdate(userId, { $set: { ...req.body } }, { new: true });
    res.status(200).send({
      success: true,
      message: "Profile Updated Succesfully",
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating profile"
    })
  }
})
routes.put("/password-change",fetchUser,async(req,res)=>{
  try {
    const {password,oldpassword}=req.body;
    userId = req.user.id;
    if(!password ||password.length<5)
    res.status(400).send({success:false,message:"Password cannot be blank"});
    const check=await User.findById(userId);
    const decode=await bcrypt.compare(oldpassword,check.password);

    if(!decode)
    res.status(400).send({success:"False",message:"Incorrect Old Password"})

    
    const newpassword=await bcrypt.hash(req.body.password, 10);
    const user = await User.findByIdAndUpdate(userId, { $set: { password:newpassword } }, { new: true });
    res.status(200).send({
      success: true,
      message: "Password Updated Succesfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while Changing password"
    })
  }
})
routes.get("/allUsers",isAdmin,async(req,res)=>{
  try {
    const users=await User.find({role:0}).select("-password");
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({success:false,message:"Error while fetching all users"})
  }
})
routes.delete("/deleteUser/:id",isAdmin,async(req,res)=>{
  try {

    const order=await Order.deleteOne({buyer:req.params.id})
    const user=await User.findByIdAndDelete(req.params.id);

    res.status(200).send({success:true});
  } catch (error) {
    console.log(error);
    res.status(500).send({success:false,message:"Error while Deleting user"})
  }
})
module.exports = routes;