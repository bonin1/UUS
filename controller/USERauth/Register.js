const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const User = require('../../model/UsersModel');

const upload = require('../../config/UploadImageConfig');

exports.register = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const {
        name,
        lastname,
        dep_id,
        role,
        email,
        phone_number,
        address
    } = req.body;
    
    try {
        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            req.session.alert = { type: 'danger', message: 'User already exists' };
            return res.redirect('/protected');
        } else {
            const newUser = await User.create({
                name,
                lastname,
                dep_id,
                role,
                email,
                phone_number,
                address
            });
            req.session.alert = { type: 'success', message: 'User created successfully' };


            try {
                if (req.files) {
                    const imagesPromises = req.files.map(async (file) => {
                        const newImage = {
                            name: file.originalname,
                            data: fs.readFileSync(file.path)
                        };
                        const image = await UserImage.create({
                            user_id: newUser.id,
                            photo_user: newImage.data
                        });
                        await fs.promises.unlink(file.path);
                        return image;
                    });
                    await Promise.all(imagesPromises);
                    return res.redirect('/protected');
                } else {
                    console.log('No files were uploaded.');
                    res.redirect('/protected')
                }
            } catch (err) {
                console.error('Error processing files:', err);
            }
            
        }
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'An error occurred while creating user.' });
    }
};