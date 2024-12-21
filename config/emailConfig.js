require('dotenv').config();

module.exports = {
    emailConfig: {
        user: process.env.EMAIL_USER,
        pass: process.env.ADMIN_PASSWORD,
        adminReceiver: process.env.EMAIL_ADMIN
    }
};
