const mongoose=require("mongoose");
const db_url="mongodb://127.0.0.1/testReact";
mongoose.set('strictQuery', true);
const connectToMongo=()=>
{
    mongoose.connect(db_url)
    .then(()=>{
        console.log("Connected to Mongoose");
    })
    .catch((err)=>{
        console.log("Error")
        console.log(err);
    })
}
module.exports=connectToMongo;
