const jwt = require('jsonwebtoken');
const User = require('../model/UsersModel');

const getUserFromToken = async (req) => {
    try {
        const token = req.cookies.authToken || req.cookies.sessionToken || req.cookies.rememberToken || req.cookies.userId;
        
        if (!token) {
            console.log('Available cookies:', req.cookies);
            throw new Error('No token provided');
        }

        console.log('Found token, attempting to verify...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
        
        console.log('Searching for user with id:', decoded.userId);
        const user = await User.findByPk(decoded.userId, {
            attributes: ['id', 'role', 'name', 'lastname', 'email']
        });

        console.log('Database query result:', user ? 'User found' : 'User not found');
        if (user) {
            console.log('User details:', { id: user.id, role: user.role, name: user.name });
        }

        if (!user) {
            const userCount = await User.count();
            console.log('Total users in database:', userCount);
            throw new Error(`User not found for id: ${decoded.userId}`);
        }

        return user;
    } catch (error) {
        console.error('GetAdminTokenId error details:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
};

module.exports = { getUserFromToken };