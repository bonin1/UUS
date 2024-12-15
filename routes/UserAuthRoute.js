const express = require('express');
const router = express.Router();
const upload = require('../config/UploadImageConfig');


const { register } = require('../controller/USERauth/Register');
const { loginPath , LoginPost } = require('../controller/USERauth/Login');
const { profile } = require('../controller/USERauth/Profile');

// Register a new user
router.post('/register', upload.array('files', 10), register)

router.get('/login', loginPath)

router.post('/login', LoginPost)

router.get('/profile', profile)


module.exports = router;