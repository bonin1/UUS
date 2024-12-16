const express = require('express');
const router = express.Router();
const { loginPath , LoginPost } = require('../controller/USERauth/Login');
const { GetPasswordChangePage, ConfirmChange } = require('../controller/USERauth/Password/Paths');
const { ChangePassword, PasswordChangingSystem } = require('../controller/USERauth/Password/RequestPassword');
const { Logout, LogoutAdmin } = require('../controller/USERauth/Logout'); 

// Login page for user
router.get('/login', loginPath)

// Login a user
router.post('/login', LoginPost)

// Change password page
router.get('/change-pw', GetPasswordChangePage)

// Change password
router.post('/change-pw', ChangePassword)

// Logout a user
router.post('/logout', Logout)

// Logout an admin
router.post('/logout-admin', LogoutAdmin)


router.get('/confirm-change', ConfirmChange)


router.post('/confirm-change', PasswordChangingSystem)

module.exports = router;