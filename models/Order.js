const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const orderSchema=new Schema({
    products:[
        {
        type:Schema.Types.ObjectId,
        ref:"Product"
    }],
    payment:{},
    buyer:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        default:"Not Processed",
        enum:["Not Processed","Processing","Shipped","Delivered","Cancel"]
    }
},
{timestamps:true})
module.exports=mongoose.model("Order",orderSchema);