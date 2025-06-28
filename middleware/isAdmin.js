const jwt = require('jsonwebtoken');
require('dotenv').config();

function isAdmin(req, res, next) {
    const token = req.cookies.authToken || req.cookies.sessionToken || req.cookies.rememberToken;

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).send('Access denied. Admins only.');
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid token.');
    }
}

module.exports = isAdmin;
