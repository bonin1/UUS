const express = require("express")
const app = express()
const bodyParser = require('body-parser');

require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use("/static", express.static('static'));



app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/apply',(req,res)=>{
    res.render('apply')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/change-pw',(req,res)=>{
    res.render('change-pw')
})
app.get('/confirm-change',(req,res)=>{
    res.render('confirm-change')
})


app.listen(process.env.PORT, ()=>{
    console.log('Ready!')
})
