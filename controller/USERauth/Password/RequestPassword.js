const { isEmail } = require('validator');
const { Op } = require('sequelize');
const Login = require('../../../model/LoginModel');
const bcrypt = require('bcryptjs');


exports.ChangePassword = async (req, res) => {
    try {
        const { email } = req.body;
    
        if (!isEmail(email)) {
            req.flash('danger', 'Email is in wrong format!');
            res.redirect('/auth/change-pw');
        } else {
            const user = await Login.findOne({ where: { email: { [Op.eq]: email } } });
            if (user) {
                req.session.email = email;
                res.redirect('/auth/confirm-change');
            } else {
                req.flash('danger', 'Email is not found!');
                res.redirect('/auth/change-pw');
            }
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


exports.PasswordChangingSystem = async (req, res) => {
    try {
        const { email, oldPassword, newPassword,confirmPassword } = req.body;
        const user = await Login.findOne({ where: { email } });

        if (!user) {
            req.flash('danger', 'Email not found');
            return res.redirect('/auth/confirm-change'); 
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            req.flash('danger', 'Invalid old password');
            return res.redirect('/auth/confirm-change'); 
        }

        if (newPassword !== confirmPassword) {
            req.flash('danger', 'New password and confirm password do not match');
            return res.redirect('/auth/confirm-change'); 
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await Login.update({ password: hashedNewPassword }, { where: { email } });

        req.flash('success', 'Password updated successfully');
        return res.redirect('/auth/confirm-change'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};