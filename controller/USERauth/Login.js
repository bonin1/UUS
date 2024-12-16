const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config();
const jwt = require('jsonwebtoken');



const loginlimitter = require('../../middleware/loginlimitter')
const LoginInformation = require('../../model/LoginModel')
router.use(loginlimitter)


exports.loginPath = (req, res) => {
    if (req.cookies.rememberToken) {
        return res.redirect('/e-learning');
    }
    const csrfToken = crypto.randomBytes(64).toString('hex');
    req.session.csrfToken = csrfToken;
    res.render('login', { message: '', csrfToken});
};


exports.LoginPost = async (req, res) => {
    if(req.body._csrf !== req.session.csrfToken) {
        return res.status(401).send('Invalid CSRF token');
    }
    
    const email = req.body.email;
    const password = req.body.password;

    if (!validator.isEmail(email)) {
        return res.render('login', { message: 'Invalid email address', csrfToken: req.session.csrfToken });
    }

    if (!validator.isLength(password, { min: 8 })) {
        return res.render('login', { message: 'Password must be at least 8 characters', csrfToken: req.session.csrfToken });
    }
    
    try {
        const userLogin = await LoginInformation.findOne({ where: { email: email } });
        if (!userLogin) {
            return res.render('login', { message: 'Incorrect email or password', csrfToken: req.session.csrfToken });
        }

        const isPasswordValid = await bcrypt.compare(password, userLogin.password);
        if (!isPasswordValid) {
            return res.render('login', { message: 'Incorrect email or password', csrfToken: req.session.csrfToken });
        }

        const rememberMe = req.body.rememberMe === 'on';
        if (rememberMe) {
            const token = jwt.sign({ userId: userLogin.user_id, email: userLogin.email },  process.env.JWT_SECRET, { expiresIn: '30d' });
            res.cookie('rememberToken', token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
        }
        
        req.session.isLoggedIn = true;
        req.session.userId = userLogin.user_id;
        res.redirect('/e-learning');
    } catch (err) {
        console.error(err);
        return res.render('login', { message: 'An error occurred while processing your request', csrfToken: req.session.csrfToken });
    }
};