const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADMIN, 
        pass: process.env.ADMIN_PASSWORD,
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

const sendEmail = async (mailOptions) => {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.info(`Email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendResetEmail = async (toEmail, token, name) => {
    const resetLink = `${process.env.BASE_URL}/auth/change-pw?token=${token}`;
    
    const templatePath = path.resolve(__dirname, '../template/ResetPassword.html');
    
    try {
        let emailTemplate = fs.readFileSync(templatePath, 'utf8');

        emailTemplate = emailTemplate
            .replace('{{resetLink}}', resetLink)
            .replace('{{username}}', name);

        const mailOptions = {
            from: `<${process.env.EMAIL_ADMIN}>`,
            to: toEmail,
            subject: "Password Reset Request",
            html: emailTemplate
        };

        await sendEmail(mailOptions);
    } catch (error) {
        console.error("Error sending reset email:", error);
        throw error;
    }
};

const sendNewsNotification = async (toEmail, newsTitle, newsContent) => {
    const templatePath = path.resolve(__dirname, '../template/NewsNotification.html');
    
    try {
        let emailTemplate = fs.readFileSync(templatePath, 'utf8');

        emailTemplate = emailTemplate
            .replace('{{newsTitle}}', newsTitle)
            .replace('{{newsPreview}}', newsContent.substring(0, 200) + '...');

        const mailOptions = {
            from: `<${process.env.EMAIL_ADMIN}>`,
            to: toEmail,
            subject: "New News Article Published",
            html: emailTemplate
        };

        await sendEmail(mailOptions);
    } catch (error) {
        console.error("Error sending news notification:", error);
        throw error;
    }
};

module.exports = {
    sendResetEmail,
    sendNewsNotification,
};