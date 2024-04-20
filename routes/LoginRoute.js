const express = require('express');
const session = require('express-session');
const db = require('../database');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const validator = require('validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config();

const loginlimitter = require('../middleware/loginlimitter')
const LoginInformation = require('../model/LoginModel')

router.use(loginlimitter)

router.use(helmet());
router.use(cookieParser());
router.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'strict'
    }
}));
router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

router.get('/', (req, res) => {
    const csrfToken = crypto.randomBytes(64).toString('hex');
    req.session.csrfToken = csrfToken;
    res.render('login', { message: '', csrfToken});
});

module.exports = router;