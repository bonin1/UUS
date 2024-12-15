const express = require('express');
const app = express();
const User = require('../../../model/UsersModel');
const Login = require('../../../model/LoginModel');
const bcrypt = require('bcryptjs');


exports.DeleteLoginInformation = async (req, res) => {
    const userId = req.params.id;
    try {

        const login = await Login.findOne({
            where: { user_id: userId }
        });

        if (login) {
            await login.destroy();
        }

        res.redirect(`/admin/logininformation/${userId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.CreateLoginInformation = async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).send('Email is required.');
        }

        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'name', 'lastname', 'dep_id', 'role', 'email', 'phone_number', 'address']
        });

        const hashPassword = await bcrypt.hash(password, 8);

        const [login, created] = await Login.findOrCreate({
            where: { user_id: userId },
            defaults: {
                email: email,
                password: hashPassword
            }
        });

        if (!created) {
            await login.update({
                email: email,
                password: hashPassword
            });
        }

        res.redirect(`/admin/logininformation/${userId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.UpdateLoginInformation = async (req, res) => {
    const userId = req.params.id;
    const { email } = req.body; 
    try {
        const user_update = await Login.update({
            email: email
        }, {
            where: { user_id: userId }
        });
        req.flash('success','User got edited successfuly!')
        res.redirect(`/admin/logininformation/${userId}`)
    } catch (error) {
        console.log("Error somewhere here: ", error);
        res.status(500).send('Internal server error');
    }
};