const express = require('express')
const app = express()
const PORT = 3000 
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