const controller = require('./Controller');
const Arbitrage = require('../utilities/checkArbitrage');

class ArbitrageController extends controller {
    async Index(req, res) {
        try {
            let options = {
                exchanges: ['kraken','bittrex', 'binance'],
                percent: 2.5,
                usdIsUsdt: false,
            };
            const arbitrage = new Arbitrage(options);
            let response = await arbitrage.CalculateArbitrage();
            return res.json(response);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = new ArbitrageController();