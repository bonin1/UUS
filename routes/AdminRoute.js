const express = require('express');
const router = express.Router();

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
const { handleChangeRequest, viewChangeRequests, handleBulkChangeRequests } = require('../controller/Admin/Request');
const { createDepartment, updateDepartment, deleteDepartment } = require('../controller/Admin/Department/CRUDoperations');
const { CreateStudyLevel, UpdateStudyLevel, DeleteStudyLevel } = require('../controller/Admin/StudyLevel/CRUDoperations');

const isAdmin = require('../middleware/isAdmin');
const isAdminOrStaff = require('../middleware/isAdminorStaff');
const upload = require('../config/UploadImageConfig');

// --------------------------------------------

// Get register user page
router.post('/register', isAdmin, upload.array('files', 10), register)

// --------------------------------------------

// Get delete erasmus application page
router.post('/delete-erasmus-application/:id', isAdmin, DeleteErasmusApplication);

// search partners
router.post('/search/partners', SearchPartners);

router.get('/change-requests', isAdmin, viewChangeRequests);

router.post('/change-requests/:requestId/handle', isAdmin, handleChangeRequest);

router.post('/change-requests/bulk', handleBulkChangeRequests);

// --------------------------------------------

// Get admin login page
router.get('/', adminLoginPath);

// Post login information
router.post('/login', adminLoginPost);

// --------------------------------------------

// Get login information page
router.get('/LoginInformation/:id', isAdminOrStaff, LoginInformationPath);

//CRUD operations
// Create login information
router.post('/create-login-information/:id', isAdminOrStaff, CreateLoginInformation);

// Delete login information
router.post('/delete-login-information/:id', isAdminOrStaff, DeleteLoginInformation);

// Update login information
router.post('/update-login-information/:id', isAdminOrStaff, UpdateLoginInformation);

//--------------------------------------------

// Get user page
router.get('/user/:id', isAdmin, GetUserPage);

router.post('/delete-user/:id', isAdmin, DeleteUser);

router.post('/edit-user/:id', isAdmin, EditUser);

//CRUD for images
// Insert user image
router.post('/insert-user-image/:id', isAdmin, upload.array('files'), InsertUserImage);

// Update user image
router.post('/update-user-image/:id', isAdmin, upload.single('file'), UpdateUserImage);

// Delete user image
router.post('/delete-user-image/:id', isAdmin, DeleteUserImage);

//--------------------------------------------
// Protected path
router.get('/protected', isAdminOrStaff, ProtectedPath);

// --------------------------------------------

// Get partner page
router.get('/partners/:id', isAdminOrStaff, PartnerPath);

//CRUD operations
// Insert partner 
router.post('/create-partner', isAdminOrStaff, upload.array('photos'), CreatePartner);

// Delete partner
router.post('/delete-partner/:id', isAdminOrStaff, DeletePartner);

// Edit partner
router.post('/edit-partner/:id', isAdminOrStaff, EditPartner);

// Update partner image
router.post('/update-partner-image/:id', isAdminOrStaff, upload.single('photo'), UpdatePartnerImage);

// --------------------------------------------

//CRUD operations for departments
// Create department
router.post('/create-department', isAdminOrStaff, createDepartment);

// Update department
router.post('/update-department/:id', isAdminOrStaff, updateDepartment);

// Delete department
router.post('/delete-department/:id', isAdminOrStaff, deleteDepartment);

// --------------------------------------------
//CRUD operations for study levels
// Create study level
router.post('/create-study-level', isAdminOrStaff, CreateStudyLevel);

// Update study level
router.post('/update-study-level/:study_level_id', isAdminOrStaff, UpdateStudyLevel);

// Delete study level
router.post('/delete-study-level/:study_level_id', isAdminOrStaff, DeleteStudyLevel);

// --------------------------------------------


module.exports = router;
