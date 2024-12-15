const fs = require('fs');
const UserImage = require('../../../model/UserImageModel');
const User = require('../../../model/UsersModel');

exports.UpdateUserImage = async (req, res) => {
    const userId = req.params.id;
    const newImage = {
        name: req.file.originalname,
        data: req.file.buffer 
    };

    try {
        const user = await User.findOne({ where: { id: userId } });
        
        if (!user) {
            req.flash('danger', 'User not found!');
            return res.redirect('/admin/protected');
        }

        const image = await UserImage.findOne({
            where: { user_id: user.id }
        });

        if (!image) {
            await UserImage.create({
                user_id: user.id, 
                photo_user: newImage.data
            });
        } else {
            image.photo_user = newImage.data;
            await image.save();
        }

        req.flash('success', 'Image updated successfully!');
        res.redirect(`/admin/user/${userId}`);
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Error updating image!');
        res.redirect(`/admin/user/${userId}`);
    }
};

exports.DeleteUserImage = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            req.flash('danger', 'User not found!');
            return res.redirect('/admin/protected');
        }
        const image = await UserImage.findOne({
            where: { user_id: user.id }
        });

        if (!image) {
            req.flash('danger', 'Image not found');
            return res.redirect(`/admin/user/${userId}`);
        }

        await image.destroy();
        req.flash('success', 'Image deleted successfully!');
        res.redirect(`/admin/user/${userId}`);
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Error deleting image!');
        res.redirect(`/admin/user/${userId}`);
    }
};


exports.InsertUserImage = async (req, res) => {
    const userId = req.params.id;
    try {
        const existingImage = await UserImage.findOne({
            where: { user_id: userId }
        });
        if (existingImage) {
            return res.status(400).send('User already has an image. Cannot insert another.');
        }

        const imagesPromises = req.files.map(async (file) => {
            const newImage = {
                name: file.originalname,
                data: file.buffer
            };
            const image = await UserImage.create({
                user_id: userId,
                photo_user: newImage.data
            });
            return image;
        });
        await Promise.all(imagesPromises);
        req.flash('success', 'Insert is successful!');
        res.redirect(`/admin/user/${userId}`);
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Insert is not successful, try again later!');
        res.redirect(`/admin/user/${userId}`);
    }
};