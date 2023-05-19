const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const categorySchema=Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        lowerCase:true
    }

})
module.exports=mongoose.model("Category",categorySchema);