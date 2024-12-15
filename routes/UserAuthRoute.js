const express = require('express');
const router = express.Router();
const { loginPath , LoginPost } = require('../controller/USERauth/Login');



// Login page for user
router.get('/login', loginPath)

// Login a user
router.post('/login', LoginPost)


module.exports = router;