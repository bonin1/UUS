const express = require('express')
const router = express.Router();
const Partner = require('../model/Partners')



router.get('/',(req,res)=>{
    res.render('partners')
})

module.exports = router;