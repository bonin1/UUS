
const fs = require('fs');
const UserImage = require('../../model/UserImageModel');
const sharp = require('sharp');


exports.UpdateProfileImage = async (req, res) => {
    const imageId = req.params.id; 

    try {
        if (req.file) {
            const processedImage = await sharp(req.file.buffer)
                .resize(150, 150)
                .jpeg({ quality: 80 })
                .toBuffer();

                const image = await UserImage.findByPk(imageId);

            if (!image) {
                return res.status(404).json({ error: 'Image not found' });
            }

            await image.update({ photo_user: processedImage });
        }

        req.flash('success', 'Image updated successfully!');
        res.redirect('/user/Profile');
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Error updating image!');
        res.redirect('/user/Profile');
    }
};



exports.DeleteProfileImage = async (req, res) => {
    const imageId = req.params.id; 

    try {
        const image = await UserImage.findByPk(imageId);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        await image.destroy();

        req.flash('success', 'Image deleted successfully!');
        res.redirect('/user/Profile');
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Error deleting image!');
        res.redirect('/user/Profile');
    }
};


exports.InsertProfileImage = async (req, res) => {
    const userId = req.params.id;
    try {
        if (req.file) {
            const processedImage = await sharp(req.file.buffer)
                .resize(150, 150)
                .jpeg({ quality: 80 })
                .toBuffer();

            const [userImage] = await UserImage.findOrCreate({
                where: { user_id: userId },
                defaults: { photo_user: processedImage }
            });

            if (!userImage.isNewRecord) {
                await userImage.update({ photo_user: processedImage });
            }
        }
        req.flash('success', 'Insert is successful!');
        res.redirect('/user/Profile')
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Insert is not successful, try again later!');
        res.redirect('/user/Profile')
    }
};