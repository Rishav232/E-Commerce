const jwt=require("jsonwebtoken");
const JWT_SECRET=process.env.JWT_SECRET||"thisismysecret";
const User=require("../models/Auth");
const isAdmin=async(req,res,next)=>{
    const token=req.header("auth-token");
    if(!token)
    {
        res.status(404).send({error:"Not Authorized"});
    }
    const decode=jwt.verify(token,JWT_SECRET);
    req.user=decode.user;
    // console.log(req.user.id);
    const user=await User.findById(decode.user.id);
    if(user.role!==1)
    {
        res.status(404).send({error:"Not Authorized for routing"});
    }

    next();
}
module.exports=isAdmin;