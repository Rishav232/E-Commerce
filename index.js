require('dotenv').config()
const connectToMongo=require("./db");
connectToMongo();
const express=require("express");
const app=express();
const cors=require("cors");
app.use(express.json());
app.use(cors());
app.use("/api/auth",require("./routes/auth"))
app.use("/api/category",require("./routes/category"))
app.use("/api/product",require("./routes/events"))
const PORT=process.env.PORT||80;
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT} running on ${process.env.DEV_MODE}`);
})
app.get("/",(req,res)=>{
    res.send("Hey There")
})
 
