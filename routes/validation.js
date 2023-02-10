//VALIDATION
const Joi=require('@hapi/joi')
//Schema for validation for registration
const registerValidation=(data)=>{
    const schema=Joi.object({
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(6).required(),
        confirmpassword:Joi.string().min(6).required()
    })
    return schema.validate(data)
}
const loginValidation=(data)=>{
    const schema=Joi.object({
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(6).required()
    })
    return schema.validate(data)
}

module.exports.registerValidation=registerValidation;
module.exports.loginValidation=loginValidation;