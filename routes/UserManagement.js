const express = require('express');
const router = express.Router();
const upload = require('../config/UploadImageConfig');

const { profile } = require('../controller/Profile/Profile');
const { UserSearch } = require('../controller/SEARCH/SearchUser');
const { UpdateProfileImage, DeleteProfileImage, InsertProfileImage } = require('../controller/Profile/ImageCrudOperations');


const authMiddleware = require('../middleware/AuthMiddleware');

// search users
router.post('/search', UserSearch);

// profile page
router.get('/profile', authMiddleware, profile)

// update profile image
router.post('/profile/update/:id', authMiddleware, upload.single('file'), UpdateProfileImage);

// delete profile image
router.post('/profile/delete/:id', authMiddleware, DeleteProfileImage);

// insert profile image
router.post('/profile/insert/:id', authMiddleware, upload.single('file'), InsertProfileImage);



module.exports = router;