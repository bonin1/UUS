const express = require('express');
const router = express.Router();
const { loginPath , LoginPost } = require('../controller/USERauth/Login');
const { GetPasswordChangePage, ConfirmChange } = require('../controller/USERauth/Password/Paths');
const { requestResetPassword, resetPassword } = require('../controller/USERauth/Password/RequestPassword');

const { Logout, LogoutAdmin } = require('../controller/USERauth/Logout'); 

// Login page for user
router.get('/login', loginPath)

// Login a user
router.post('/login', LoginPost)

// Change password page
router.get('/change-pw', GetPasswordChangePage)

// Logout a user
router.post('/logout', Logout)

// Logout an admin
router.post('/logout-admin', LogoutAdmin)

// Request a password reset (sends reset email)
router.post('/forgot-password', requestResetPassword);

// Reset password using token from request body
router.post('/reset-password', resetPassword);


module.exports = router;