const jwt = require('jsonwebtoken');
const User = require('../model/UsersModel');

const getUserFromToken = async (req) => {
    try {
        const token = req.cookies.authToken;
        
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ 
            where: { id: decoded.userId },
            attributes: ['id', 'role', 'name', 'lastname'] 
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        throw error;
    }
};

module.exports = { getUserFromToken };