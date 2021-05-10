const express = require('express');
const router = express.Router();

router.get('/',(req,res) => res.send('binanceRoutes/home'));
router.get('/payam',(req,res) => res.send('binanceRoutes/payam/'));


module.exports = router;
