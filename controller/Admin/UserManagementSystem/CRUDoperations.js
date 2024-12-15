const User = require('../../../model/UsersModel');

exports.DeleteUser = async (req, res) => {
    const userId = req.params.id;
    try {

        const login = await User.findOne({
            where: { id: userId }
        });

        if (login) {
            await User.destroy();
        }

        res.redirect(`/admin/user/${userId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.EditUser = async (req, res) => {
    const userId = req.params.id;
    const { name, lastname, dep_id,role,email,phone_number,address } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
    
        user.name = name;
        user.lastname = lastname;
        user.dep_id = dep_id;
        user.role = role;
        user.email = email;
        user.phone_number = phone_number;
        user.address = address;

        await user.save();
        req.flash('success', 'User got edited successfully!');
        res.redirect(`/admin/user/${userId}`);
        } catch (error) {
        console.error('Error updating user:', error);
        req.flash('danger', 'Error editing User!');
    }
};