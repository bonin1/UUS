const express = require('express');
const router = express.Router();
const User = require('../model/UsersModel');
const LoginInformation = require('../model/LoginModel');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'strict'
    }
}));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

async function isAdmin(req, res, next) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        const loginInfo = await LoginInformation.findOne({ where: { email: email } });

        if (!loginInfo || !(await bcrypt.compare(password, loginInfo.password))) {
            res.status(401).send('Invalid email or password.');
            return;
        }

        const user = await User.findOne({ where: { id: loginInfo.user_id } });
        if (!user) {
            return res.status(401).send('User not found.');
        }
        if (user.role === 'admin') {
            req.session.user = { id: user.id, role: user.role };
            next();
        } else {
            res.status(403).send('You do not have permission to access this resource.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred.');
    }
}

router.get('/', (req, res) => {
    res.render('admin')
});

router.post('/', isAdmin, (req, res) => {
    res.redirect('/protected');
});

module.exports = router;
