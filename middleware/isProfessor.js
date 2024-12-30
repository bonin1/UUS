const jwt = require('jsonwebtoken');
require('dotenv').config();

function isProfessor (req, res, next) {
    const token = req.cookies.authToken || req.cookies.rememberToken || req.cookies.sessionToken;

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'professor') {
            return res.status(403).send('Access denied. Professors only.');
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid token.');
    }
}

module.exports = isProfessor;