const jwt = require('jsonwebtoken');
const LoginInformation = require('../model/LoginModel'); 

const checkAccessMiddleware = async (req, res, next) => {
    try {
        if (req.cookies.rememberToken && !req.session.isLoggedIn) {
            const token = req.cookies.rememberToken;

            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                const user = await LoginInformation.findOne({ where: { user_id: decodedToken.userId } });

                if (!user) {
                    return res.status(401).send('Unauthorized: Invalid token or user not found');
                }

                req.session.isLoggedIn = true;
                req.session.userId = user.user_id;
                return next();
            } catch (err) {
                console.error('Invalid or expired token:', err);
                res.clearCookie('rememberToken'); 
                return res.redirect('/login');
            }
        }

        if (req.session.isLoggedIn) {
            return next();
        }

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error in checkAccessMiddleware:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = checkAccessMiddleware;
