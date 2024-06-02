const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('../model/UsersModel');
const Department = require('../model/DepartmentModel');
const Login = require('../model/LoginModel');
const UserImage = require('../model/UserImageModel');

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

router.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
});

router.get('/', async (req, res) => {
    if (!req.session.isLoggedIn) {
        const rememberToken = req.cookies.rememberToken;
        if (rememberToken) {
            try {
                const decoded = jwt.verify(rememberToken, process.env.JWT_SECRET);
                req.session.isLoggedIn = true;
                req.session.userId = decoded.userId;
            } catch (err) {
                console.error('Invalid or expired remember token:', err);
                return res.redirect('/login');
            }
        } else {
            return res.redirect('/login');
        }
    }

    const userId = req.session.userId;
    try {
        const userData = await User.findByPk(userId, {
            include: [{ model: Department }],
        });

        const loginInfo = await Login.findOne({ where: { user_id: userId } });

        if (!userData) {
            return res.status(404).send('User not found');
        }

        res.render('dmis', { userData, loginInfo});
    } catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred while fetching user data');
    }
});

module.exports = router;
