const express = require("express")
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const router = express.Router();
const Login = require('../model/LoginModel')
const session = require('express-session');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'strict'
    }
}));


router.get('/', (req, res) => {
    const email = req.session.email;
    res.render('confirm-change', { email , successAlert: req.flash('success'), dangerAlert: req.flash('danger') });
});

router.post('/', async (req, res) => {
    try {
        const { email, oldPassword, newPassword,confirmPassword } = req.body;
        const user = await Login.findOne({ where: { email } });

        if (!user) {
            req.flash('danger', 'Email not found');
            return res.redirect('/confirm-change'); 
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            req.flash('danger', 'Invalid old password');
            return res.redirect('/confirm-change'); 
        }

        if (newPassword !== confirmPassword) {
            req.flash('danger', 'New password and confirm password do not match');
            return res.redirect('/confirm-change'); 
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await Login.update({ password: hashedNewPassword }, { where: { email } });

        req.flash('success', 'Password updated successfully');
        return res.redirect('/confirm-change'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});




module.exports = router