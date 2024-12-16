const express = require('express');
const router = express.Router();

const { PartnersPath } = require('../controller/Partners/Paths');

router.get('/', PartnersPath);


module.exports = router;
