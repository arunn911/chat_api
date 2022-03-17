const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")


const authenticate = asyncHandler( async (req,res,next) => {
   let token = req.header("auth-token");
   if(token){
     try{
        const decrypted = jwt.verify(token, process.env.JWT_KEY)
        req.user = await User.findById(decrypted.id).select({password: 0})
        next();
     }
     catch{
        res.status(401).send({message:"Token Invalid"})
        throw new Error("Authentication failed token invalid")
     }
   } 
   if(!token){
    res.status(401).json({message:"No token available please login"})
    throw new Error("Login to continue")
} 
})


module.exports = authenticate