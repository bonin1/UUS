const jwt = require('jsonwebtoken');
require('dotenv').config();

function isProfessor (req, res, next) {
    const token = req.cookies.sessionToken || req.cookies.rememberToken || req.cookies.authToken;

    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'professor') {
            console.log('Invalid role:', decoded.role);
            return res.status(403).send('Access denied. Professors only.');
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(400).send('Invalid token.');
    }
}

module.exports = isProfessor;