const express = require('express')
const app = express()
const hbs=require('hbs')
const path=require('path')
const port = process.env.PORT || 5000
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const bodyParser=require('body-parser')
const cookieParser=require("cookie-parser")
//import Routes
const authRoute=require('./routes/auth')
const auth=require("./routes/verifyToken")

dotenv.config();
//app.use(bodyParser.json())

//Connect to DB
mongoose.set('strictQuery',false)
mongoose.connect(process.env.DB_CONNECT,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
}).then (()=>{
  console.log("DB Connected");
}).catch((err)=> console.log(err));

//middlewares
app.use(express.json()) //body parser 
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())


//Route middlewares
 app.use('/',authRoute);
 

 //hosting static website
app.use(express.static(__dirname+'/public'))
//Set template engine
app.set('view engine','hbs')
app.set('views', path.join(__dirname, '/views'));


// rendering the webpages
app.get('/',(req,res)=>{
  res.render("index")
})
app.get('/protected',auth,(req,res)=>{
  res.render("protected")
})
 app.get('/register',(req,res)=>{
   res.render("register")
 })
 app.get('/login',(req,res)=>{
   res.render("login")
 })
 app.get('/logout',auth, async(req,res)=>{
   try{
      req.user.tokens=req.user.tokens.filter((currElement)=>{
          return currElement.token !== req.token
      })
      res.clearCookie("jwtoken")
      //console.log("logout success")
      await req.user.save()
      res.render("login")
   }catch{
    res.status(500).send(error)
   }
 })



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


