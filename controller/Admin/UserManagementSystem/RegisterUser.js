const User = require('../../../model/UsersModel');
const UserImage = require('../../../model/UserImageModel'); 

exports.register = async (req, res) => { 
    const { name, lastname, dep_id, role, email, phone_number, address } = req.body;

    try {
        const existingUser = await User.findOne({
            where: { email: email }
        });

        if (existingUser) {
            req.session.alert = { type: 'danger', message: 'User already exists' };
            return res.redirect('/admin/protected');
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
                if (req.files && req.files.length > 0) {
                    const imagesPromises = req.files.map(async (file) => {
                        const imageBuffer = file.buffer; 

                        const image = await UserImage.create({
                            user_id: newUser.id,
                            photo_user: imageBuffer 
                        });

                        return image;
                    });
                    await Promise.all(imagesPromises);
                    return res.redirect('/admin/protected');
                } else {
                    console.log('No files were uploaded.');
                    res.redirect('/admin/protected');
                }
            } catch (err) {
                console.error('Error processing files:', err);
                res.status(500).json({ error: 'Error processing files' });
            }
        }
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'An error occurred while creating user.' });
    }
};
