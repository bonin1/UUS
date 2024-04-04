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
app.get('apply',(req,res)=>{
    res.render('apply')
})

app.listen(process.env.PORT, ()=>{
    console.log('Ready!')
})
