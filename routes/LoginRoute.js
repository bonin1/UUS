const express = require('express');
const session = require('express-session');
const db = require('../database');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const validator = require('validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config();

const loginlimitter = require('../middleware/loginlimitter')
const LoginInformation = require('../model/LoginModel')

router.use(loginlimitter)

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

router.use((req, res, next) => {
    if (req.cookies.rememberToken && !req.session.isLoggedIn) {
        req.session.isLoggedIn = true;
        req.session.userId = req.cookies.rememberToken;
        return res.redirect('/e-learning');
    } else {
        next();
    }
});


router.get('/', (req, res) => {
    if (req.cookies.rememberToken) {
        return res.redirect('/e-learning');
    }
    const csrfToken = crypto.randomBytes(64).toString('hex');
    req.session.csrfToken = csrfToken;
    res.render('login', { message: '', csrfToken});
});


router.post('/', async (req, res) => {
    if(req.body._csrf !== req.session.csrfToken) {
        return res.status(401).send('Invalid CSRF token');
    }
    const email = req.body.email;
    const password = req.body.password;

    if (!validator.isEmail(email)) {
        return res.render('login', { message: 'Invalid email address',csrfToken: req.session.csrfToken });
    }

    if (!validator.isLength(password, { min: 8 })) {
        return res.render('login', { message: 'password must be 8 characters',csrfToken: req.session.csrfToken});
    }
    
    try {
        const user = await LoginInformation.findOne({ where: { email: email } });
        if (!user) {
            return res.render('login', { message: 'incorrect email or password',csrfToken: req.session.csrfToken });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', { message: 'incorrect email or password',csrfToken: req.session.csrfToken });
        }

        const rememberMe = req.body.rememberMe === 'on';
        
        if (rememberMe) {
            const rememberToken = crypto.randomBytes(64).toString('hex');
            res.cookie('rememberToken', rememberToken, { maxAge: 30 * 24 * 60 * 60 * 1000 });
        }
        
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        res.redirect('/e-learning');
    } catch (err) {
        console.log(err);
        return res.render('login', { message: 'An error occurred while processing your request', csrfToken: req.session.csrfToken });
    }
});

module.exports = router;