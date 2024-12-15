const express = require('express');
const router = express.Router();

const User = require('../../model/UsersModel');
const Department = require('../../model/DepartmentModel');
const Login = require('../../model/LoginModel');
const UserImage = require('../../model/UserImageModel');

exports.profile = async(req,res)=>{
    const userId = req.session.userId;
    const userData = await User.findByPk(userId, {
        include: [{ model: Department }],
    });
    const loginInfo = await Login.findOne({ where: { user_id: userId } });
    const images = await UserImage.findAll({
        where: { user_id: userId }
    });

    if (!userData || !loginInfo) {
        return res.status(404).send('User not found');
    }

    res.render('Profile', { userData, loginInfo, images, successAlert: req.flash('success'), dangerAlert: req.flash('danger')})
}