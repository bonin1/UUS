const express = require('express');
const app = express();
const User = require('../../../model/UsersModel');
const Login = require('../../../model/LoginModel');



exports.LoginInformationPath = async (req, res) => { 
    const userId = req.params.id;
    try {
        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'name', 'lastname', 'dep_id', 'role', 'email', 'phone_number', 'address']
        });
        const login = await Login.findOne({
            where: {user_id:userId}
        })
        res.render('logininformation',{data : user, login,  successAlert: req.flash('success'), dangerAlert: req.flash('danger')})
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}