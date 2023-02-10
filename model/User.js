const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    
    email:{
        type:String,
        required:true,
        min:6
    },
    password:{
        type:String,
        required:true,
        max:1024,
        min:8
    },
    confirmpassword:{
        type:String,
        required:true,
        max:1024,
        min:8
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

// we are generating token
userSchema.methods.generateAuthToken= async function(){
    try {
        let token=jwt.sign({_id:this._id},process.env.SECRET_TOKEN)
        this.tokens= this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        res.send("The error part"+error)
    }
} 

module.exports=mongoose.model('User',userSchema)