const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
require('dotenv').config()




router.post('/signup', async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        res.status(422).json({ messsage: "Please fill all the details" })
    }


    const existingUser = await User.findOne({email : email})

    if(existingUser){
        res.status(401).send({message: 'User already registered'})
    }

    else{


    try {
        const newUser = new User({ name, email, password, cpassword })
        await newUser.save()
        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECERET)
        res.send({message: "User registered successfully", token: token })
    } catch (err) {
        console.log(err);
        return res.status(422).json({ err: "Some Error occured" })
    }

}
})


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).send({ err: "Please fill all the details" })
    }

    const savedUser = await User.findOne({ email: email })

    if (!savedUser) {
        res.status(422).send({ err: "Invalid Credentials" })
    }

    try {
        bcrypt.compare(password, savedUser.password, (err, result) => {
            if (result) {
                console.log("password match")
                const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECERET)
                res.send({ token })
            }

            else {
                console.log("password does not match");
                res.status(422).send({ err: "Invalid Credentials" })
            }
        })
    } catch (err) {
        console.log(err);

    }

})


router.get('/userdata', (req,res)=>{
     
})


//  Nodemailer Function




router.post('/verify', async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        res.status(422).json({ messsage: "Please fill all the details" })
    }

    const user = await User.findOne({ email: email })
    if (user) {
        return res.status(422).json({ message: "User already exists" })
    }

    try {
      
        let verificationCode = Math.floor(100000 + Math.random() * 900000)
        await mailer(email, verificationCode);
        let saveduser = {
            verificationCode,
            name ,
            email,
            password,
            cpassword
          
        }
        res.send({message: "Verification code sent to your email", udata: saveduser })
    } catch (err) {
        console.log(err);
    }
})

async function mailer(reciveremail, code) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: "nabilpathan9624@gmail.com", // generated ethereal user
            pass: "oqhcrizcavlpxvom", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = {
        from: 'nabilpathan9624@gmail.com', // sender address
        to: `${reciveremail}`, // list of receivers
        subject: "Signup Verification", // Subject line
        text: "Verify your account", // plain text body
        html: `<b>Your verification code is ${code}</b>`, // html body
    };


    await transporter.sendMail(info, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Email has Sent");
        }
    })

}
module.exports = router

