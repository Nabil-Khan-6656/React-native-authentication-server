const express = require('express')
require('dotenv').config()
const app = express()
const PORT =  process.env.PORT
const bodyParser = require('body-parser')
require('./db')
const authRoutes = require('./routes/authRoutes')
require('./models/User')
const requireToken = require('./middleware/Auth')



app.use(bodyParser.json())
app.use(authRoutes)

app.get('/', requireToken ,(req,res)=>{
    res.send('Home Page')
})

app.listen(PORT , ()=>{
    console.log(`Listening on port ${PORT}`);
})