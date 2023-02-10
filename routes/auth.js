const router=require('express').Router();
const User=require('../model/User')
const {registerValidation,loginValidation}=require('../routes/validation')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const { date } = require('@hapi/joi');


//-------------------------------------------------  REGISTER ----------------------------------------------------//





router.post('/register',async(req,res)=>{
    
    //LETS VALIDATE THE DATA 
    const{error}=registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    //Checking if the user is already in the database
    const emailExist=await User.findOne({email:req.body.email})
    if(emailExist) return res.status(404).render("register",{ messages: { error: 'Email already exist' } })
    
    //Hash the password
    const salt=await bcrypt.genSalt(10)
    const hashPassword=await bcrypt.hash(req.body.password,salt)
    
           try{
               const password=req.body.password
               const cpassword=req.body.confirmpassword
               if(password===cpassword){
                 const userData=new User({
                   email:req.body.email,
                   password:hashPassword,
                   confirmpassword:hashPassword
                 })
                 const token=await userData.generateAuthToken();
                 res.cookie('jwtoken',token,{
                  expires:new Date(Date.now()+86400000), 
                  httpOnly:true
              })
             
                 const registered=await userData.save() // saving data to database
                 res.status(201).render("login")
               }else{
                res.render("register",{ messages: { error: 'Password not matching' } })

               }
        
            }catch(err){
             res.status(400).send(err)
            }
})

//-------------------------------------------------  LOGIN ----------------------------------------------------//

router.post('/login',async(req,res)=>{
  
    //LETS VALIDATE THE DATA 
  const{error}=loginValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  //Checking if the email exist
  const user=await User.findOne({email:req.body.email})
  if(!user) return res.status(404).render("login",{ messages: { error: `Email doesn't exist` } }) 

  //CHECKING IF PASSWORD IS CORRECT
    const validPass=await bcrypt.compare(req.body.password,user.password)
    if(!validPass) return res.status(400).render("login",{ messages: { error: 'Invalid login details' } })
    
    //Create and assign a token
    const token=await user.generateAuthToken();
    res.cookie('jwtoken',token,{
        expires:new Date(Date.now()+86400000), 
        httpOnly:true
    })
   // console.log(req.cookies.jwtoken);

    res.status(201).render("index")



})


module.exports=router;