const express = require('express');
const router = express.Router();
const User = require('../model/UsersModel');
const LoginInformation = require('../model/LoginModel');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');

const { LoginInformationPath } = require('../controller/Admin/LoginInformation/Paths');
const { DeleteLoginInformation, CreateLoginInformation, UpdateLoginInformation } = require('../controller/Admin/LoginInformation/CRUDoperations');
const { adminLoginPath, adminLoginPost } = require('../controller/Admin/AdminLogin');
const { GetUserPage } = require('../controller/Admin/UserManagementSystem/Paths');
const { DeleteUser, EditUser } = require('../controller/Admin/UserManagementSystem/CRUDoperations');
const { register } = require('../controller/Admin/UserManagementSystem/RegisterUser');
const { ProtectedPath } = require('../controller/Admin/Protected/Path');
const { UpdateUserImage, DeleteUserImage, InsertUserImage} = require('../controller/Admin/UserManagementSystem/ImageCRUDoperations');
const { DeleteErasmusApplication } = require('../controller/Admin/DeleteErasmusApplication');
const { PartnerPath } = require('../controller/Admin/Partners/Paths');
const { SearchPartners } = require('../controller/SEARCH/SearchPartners')
const { CreatePartner, DeletePartner, EditPartner } = require('../controller/Admin/Partners/CRUDoperations');
const { UpdatePartnerImage } = require('../controller/Admin/Partners/ImageCRUDoperations');


const isAdmin = require('../middleware/isAdmin');
const upload = require('../config/UploadImageConfig');

// --------------------------------------------

// Get register user page
router.post('/register', upload.array('files', 10), register)

// --------------------------------------------

// Get delete erasmus application page
router.post('/delete-erasmus-application/:id', DeleteErasmusApplication);

// search partners
router.post('/search/partners', SearchPartners);

// --------------------------------------------

// Get admin login page
router.get('/', adminLoginPath);

// Post login information
router.post('/login', adminLoginPost);

// --------------------------------------------

// Get login information page
router.get('/LoginInformation/:id', LoginInformationPath);

//CRUD operations
// Create login information
router.post('/create-login-information/:id', CreateLoginInformation);

// Delete login information
router.post('/delete-login-information/:id', DeleteLoginInformation);

// Update login information
router.post('/update-login-information/:id', UpdateLoginInformation);

//--------------------------------------------

// Get user page
router.get('/user/:id', isAdmin, GetUserPage);

router.post('/delete-user/:id', isAdmin, DeleteUser);

router.post('/edit-user/:id', isAdmin, EditUser);

//CRUD for images
// Insert user image
router.post('/insert-user-image/:id', upload.array('files'), InsertUserImage);

// Update user image
router.post('/update-user-image/:id', upload.single('file'), UpdateUserImage);

// Delete user image
router.post('/delete-user-image/:id', DeleteUserImage);

//--------------------------------------------
// Protected path
router.get('/protected', isAdmin, ProtectedPath);

// --------------------------------------------

// Get partner page
router.get('/partners/:id', PartnerPath);

//CRUD operations
// Insert partner 
router.post('/create-partner', upload.array('photos'), CreatePartner);

// Delete partner
router.post('/delete-partner/:id', DeletePartner);

// Edit partner
router.post('/edit-partner/:id', EditPartner);

// Update partner image
router.post('/update-partner-image/:id', upload.single('photos'), UpdatePartnerImage);

// --------------------------------------------

module.exports = router;
