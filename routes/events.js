const express = require("express");
const routes = express.Router();
const fetchID = require("../middleware/fetchID");
const Product = require("../models/Product");
const { body, validationResult } = require('express-validator');
const isAdmin = require("../middleware/isAdmin");
const formidableMiddleware = require('express-formidable');
const fs = require("fs");
const slugify = require("slugify");
const braintree = require("braintree");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/Auth");
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

routes.post("/createProducts", fetchID, isAdmin, formidableMiddleware(), async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;//this is used by express formidable to read form data
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(400).send({ success: false, message: "Name is required" });
            case !description:
                return res.status(400).send({ success: false, message: "Description is required" });
            case !price:
                return res.status(400).send({ success: false, message: "Price is required" });
            case !category:
                return res.status(400).send({ success: false, message: "Category is required" });
            case !quantity:
                return res.status(400).send({ success: false, message: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(400).send({ success: false, message: "Photo Size should be less than 1mb" });
        }
        const product = new Product({ ...req.fields, slug: slugify(name) });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);//uses  blocking i/o to read files
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).send({ success: true, message: "New Product Created", product });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred while Creating products" });
    }
})
routes.get("/getAllProducts", async (req, res) => {
    const products = await Product.find({}).select("-photo").limit(12).sort({ createdAt: -1 }).populate("category");
    res.status(200).send({
        success: true,
        TotalResults: products.length,
        message: "All Products",
        products,

    })
})
routes.get("/Product-Photo/:prodId", async (req, res) => {
    try {
        const product = await Product.findById(req.params.prodId).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);//set header content type to whatever image type is so that ww will get image result
        }
        res.status(200).send(product.photo.data);
    } catch (e) {
        console.log(e);
        res.status(500).send({ success: false, message: "Error occurred while fetching photos" })
    }
})
routes.get("/getSingleProduct/:slug", async (req, res) => {
    const product = await Product.find({ slug: req.params.slug }).select("-photo").populate("category");
    res.status(200).send({
        success: true,
        message: "One Product",
        product

    })
})
routes.delete("/deleteProduct/:prodId", fetchID, isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.prodId);
        res.status(200).send({ success: true, message: "Product Deleted Successfully" })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: false,
            message: "Error Occured"
        })
    }
})
routes.put("/update-product/:pid", fetchID, isAdmin, formidableMiddleware(), async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(400).send({ success: false, message: "Name is required" });
            case !description:
                return res.status(400).send({ success: false, message: "Description is required" });
            case !price:
                return res.status(400).send({ success: false, message: "Price is required" });
            case !category:
                return res.status(400).send({ success: false, message: "Category is required" });
            case !quantity:
                return res.status(400).send({ success: false, message: "Quantity is required" });
            case photo && photo.size > 1000000:
                return res.status(400).send({ success: false, message: "Photo Size should be less than 1mb" });
        }
        const product = await Product.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);//uses non blocking i/o to read files
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(200).send({ success: true, message: "Product Updated Successfully", product });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error occurred while Updating products" }, error);
    }
})
routes.post("/filter-product", async (req, res) => {
    try {
        let args = {};
        const { checked, price } = req.body;
        if (checked.length > 0)
            args.category = checked;
        if (price.length > 0)
            args.price = { $gte: price[0], $lte: price[1] }

        const product = await Product.find(args);
        res.status(200).send({
            success: true,
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error Occured while filtering" })
    }


})
routes.get("/totalResults", async (req, res) => {
    try {
        const product = await Product.find().select("-photo");
        res.status(200).send({
            success: true,
            message: "Total Results",
            TotalResults: product.length
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error Occurred while fetching Total results" })
    }

})
routes.get("/products-limit/:page", async (req, res) => {
    const limitPages = 6;
    const page = req.params.page;
    const product = await Product.find().select("-photo").skip((page - 1) * limitPages).limit(limitPages).sort({ createdAt: -1 });
    res.status(200).send({
        success: true,
        TotalResults: product.length,
        message: "Results",
        product
    })
})
routes.get("/search/:keyword", async (req, res) => {
    try {
        const result = await Product.find({
            $or: [
                { name: { $regex: req.params.keyword, $options: "i" } },
                { description: { $regex: req.params.keyword, $options: "i" } }
            ]
        }).select("-photo");
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in Searching"
        })
    }
})
routes.get("/related-products/:pid/:cid", async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await Product.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3);
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while fetching Similar Products" })
    }
})
//get products by category
routes.get("/productCategory/:cid", async (req, res) => {
    try {
        const products = await Product.find({
            category: req.params.cid
        }).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message: "Products by Category",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error while fetching products by category" })
    }
})
routes.get("/braintree/token", async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.send(response);
            }
        })

    } catch (error) {
        console.log(error);
    }

})
routes.post("/braintree/transaction",fetchID,async(req,res)=>{
    try {
        const {cart,nonce}=req.body;
        let total=0;
        cart.map((c)=>{total+=c.price})
        let newTransaction=gateway.transaction.sale(
            {
                amount:total,
                paymentMethodNonce:nonce,
                options:{
                    submitForSettlement:true
                }
            },
            function(err,result){
                if(err)
                {
                    console.log(err);
                    res.status(500).send({error:err})
                }
                else{
                    const order=new Order({
                        products:cart,
                        payment:result,
                        buyer:req.user.id,

                    }).save();

                    res.send({ok:true});
                }
            }
        )
    } catch (error) {
        console.log(error);
    }
})
routes.get("/getOrders",fetchID,async(req,res)=>{
    try {
        const orders=await Order.find({buyer:req.user.id}).populate("products","-photo").populate("buyer","name");
        res.json(orders);
    } catch (error) {
        console.log(error);
    }
})
routes.get("/getAllOrders",fetchID,isAdmin,async(req,res)=>{
    try {
        const orders=await Order.find({}).populate("products","-photo").populate("buyer","name");
        res.json(orders);
    } catch (error) {
        console.log(error);
    }
})
routes.put(`/updateStatus/:oID`,fetchID,isAdmin,async(req,res)=>{
    try {
        const {oID}=req.params;
        const {status}=req.body;
        const order=await Order.findByIdAndUpdate(oID,{status},{new:true});
        res.json(order);
        
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,message:"Error while updating order status"})
    }
})
module.exports = routes;