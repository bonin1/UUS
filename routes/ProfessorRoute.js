const express = require('express');
const router = express.Router();

const isProfessor = require('../middleware/isProfessor');

const {ProfessorPath} = require('../controller/Professor/Paths');

router.get('/', isProfessor, ProfessorPath);


module.exports = router;