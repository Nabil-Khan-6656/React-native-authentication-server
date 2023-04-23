const mongoose = require('mongoose')
require('dotenv').config()
const connection = mongoose.connect(process.env.MONGOURL).then(
    ()=>{
        console.log("Database Connection Successful")
    }
).catch((err)=> console.log(err))


module.exports = connection