const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');
const LoginInformation = require('../../model/LoginModel');
const User = require('../../model/UsersModel');

require('dotenv').config();

exports.adminLoginPath = (req, res) => {
    const csrfToken = crypto.randomBytes(64).toString('hex');
    res.render('admin', { message: '', csrfToken });
};

exports.adminLoginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!validator.isEmail(email)) {
        return res.render('admin', { message: 'Invalid email address' });
    }

    if (!validator.isLength(password, { min: 8 })) {
        return res.render('admin', { message: 'Password must be at least 8 characters' });
    }

    try {
        const loginInfo = await LoginInformation.findOne({ where: { email } });
        if (!loginInfo) {
            return res.render('admin', { message: 'Incorrect email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, loginInfo.password);
        if (!isPasswordValid) {
            return res.render('admin', { message: 'Incorrect email or password' });
        }

        const user = await User.findOne({ where: { id: loginInfo.user_id } });
        if (!user || user.role !== 'admin') {
            return res.render('adminLogin', { message: 'Access restricted to admins only' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, 
        });

        res.redirect('/admin/protected');
    } catch (err) {
        console.error(err);
        return res.render('adminLogin', { message: 'An error occurred while processing your request' });
    }
};
