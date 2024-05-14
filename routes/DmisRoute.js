const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const flash = require('connect-flash');

router.get('/',(req,res)=>{
    res.render('dmis', { successAlert: req.flash('success'), dangerAlert: req.flash('danger') });
});



module.exports = router;