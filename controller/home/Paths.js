const User = require('../../model/UsersModel');


exports.HomePath = async (req, res) => {
    try {
        const user = await User.find();
        res.render('home', { user });
    } catch (error) {
        res.status(500).send(error);
    }
}