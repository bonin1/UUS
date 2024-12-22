const User = require('../../../model/UsersModel');
const UserImage = require('../../../model/UserImageModel');
const Department = require('../../../model/DepartmentModel');

exports.GetUserPage = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'name', 'lastname', 'dep_id', 'role', 'email', 'phone_number', 'address']
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const images = await UserImage.findAll({
            where: { user_id: userId }
        });

        const departments = await Department.findAll();

        const availableRoles = User.rawAttributes.role.values;

        const userDataWithImage = {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            dep_id: user.dep_id,
            role: user.role,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address
        };

        res.render('user', { 
            data: userDataWithImage,
            images,
            departments,
            availableRoles,
            successAlert: req.flash('success'), 
            dangerAlert: req.flash('danger') 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};