const express = require('express'); 
const router = express.Router();


const { getComputerScience } = require('../controller/ComputerScience/Paths');

router.get('/', getComputerScience);


module.exports = router;