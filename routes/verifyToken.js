const jwt=require('jsonwebtoken')
const User=require('../model/User')

//This function verifies the jwt token
const auth= async(req,res,next)=>{
    const token=req.cookies.jwtoken  //checking the token
    if(!token) return res.status(401).render("error")
    try {
        const verified=jwt.verify(token,process.env.SECRET_TOKEN)
        const user=await User.findOne({_id:verified._id})
        req.token=token
        req.user=user

        next()
    } catch (error) {
        res.status(400).send('Invalid Token')
    }
}
module.exports=auth;

