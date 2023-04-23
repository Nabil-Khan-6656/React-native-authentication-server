const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userschema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    cpassword:{
        type:String,
        required: true
    },
})

 userschema.pre('save', async function (next){
    const user =  this ;
    if(!user.isModified('password') && !user.isModified('cpassword')){
        return next()
    }

    user.password =  await bcrypt.hash(user.password , 8)
    user.cpassword =  await bcrypt.hash(user.cpassword , 8)
    next()
 })
const userModel = mongoose.model("User", userschema)


module.exports = userModel


//  So Hey Everyone This is Nabil Khan and I am 