const express = require('express');
const router = express.Router();
const {Index} = require('../controllers/ArbitrageController');

router.get('/',Index);


module.exports = router;
