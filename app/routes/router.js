const express = require('express');
let router = express.Router();
const binanceRoutes = require('./binanceRoutes');
const arbitrageRoutes = require('./arbitrageRoutes');

//binance Routes
router.use('/arbitrage', arbitrageRoutes);
router.use('/binance', binanceRoutes);
router.get('/', (req,res)=>{res.send('api asdasd')});


module.exports = router;