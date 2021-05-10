const async = require('async');
const ccxt = require('ccxt');
const q = require('q');

class cryptoExchangeArbitrage {
    constructor(options) {
        this.exchanges = options.exchanges;
        this.greaterThan = options.percent || 1;
        this.result = [];
    }

    async CalculateArbitrage() {
        let deferred = q.defer();
        try {
            const exchanges = this.exchanges;
            if (!Array.isArray(exchanges)) deferred.reject(`${exchanges} is not an array`);
            let data = [];
            async.each(this.exchanges, onProcess, (err, res) => {
                if (err) return deferred.reject(err);
                this.reduceExchCompares(data)
                return deferred.resolve(this.result)
            });

            async function onProcess(exchange) {
                const exch = await new ccxt[exchange]().fetchTickers();
                data.push({id: exchange, data: exch});
            }
        } catch (err) {
            return deferred.reject(err);
        }
        return deferred.promise;
    }

    reduceExchCompares(allExchanges) {
        const alreadyChecked = [];
        for (let i = 0; i < allExchanges.length; i++) {
            for (let j = 0; j < allExchanges.length; j++) {
                const joinedExchanges = allExchanges[i].id + (allExchanges[j].id);
                const joinedExchanges2 = allExchanges[j].id + (allExchanges[i].id);
                if (allExchanges[i].id === allExchanges[j].id || alreadyChecked.indexOf(joinedExchanges) > -1 || alreadyChecked.indexOf(joinedExchanges2) > -1) continue;
                alreadyChecked.push(joinedExchanges, joinedExchanges2);
                const exchName1 = allExchanges[i].id;
                const exchName2 = allExchanges[j].id;
                const exch1 = allExchanges[i].data;
                const exch2 = allExchanges[j].data;
                this.getTickerArbitrage(exchName1, exchName2, exch1, exch2);
            }
        }
    }

    getTickerArbitrage(exchName1, exchName2, data1, data2) {
        for (let key in data1) {
            if (data2[key]) {
                const exch1ToExch2 = (data2[key].bid / data1[key].ask) * 100;
                const exch2ToExch1 = (data1[key].bid / data2[key].ask) * 100;
                const percentDiff = 100 + this.greaterThan;
                if (exch1ToExch2 >= percentDiff && data1[key].ask > 0) {
                    let arbitragePercent = (exch1ToExch2 - 100).toFixed(2);
                    if (arbitragePercent !== Infinity) {
                        let arbitrageObject = {
                            arbitragePercent: (exch1ToExch2 - 100).toFixed(2),
                            symbol: data1[key].symbol,
                            buyAt: exchName1,
                            sellAt: exchName2,
                            buyAsk: data1[key].ask,
                            sellBid: data2[key].bid,
                            buyInfo: data1[key],
                            sellInfo: data2[key],
                        };
                        this.result.push(arbitrageObject);
                    }
                }
                else if (exch2ToExch1 >= percentDiff && data2[key].ask > 0) {
                    let arbitragePercent = (exch2ToExch1 - 100).toFixed(2);
                    if (arbitragePercent !== Infinity) {
                        let arbitrageObject = {
                            arbitragePercent: (exch2ToExch1 - 100).toFixed(2),
                            symbol: data1[key].symbol,
                            buyAt: exchName2,
                            sellAt: exchName1,
                            buyAsk: data2[key].ask,
                            sellBid: data1[key].bid,
                            buyInfo: data2[key],
                            sellInfo: data1[key],
                        };
                        this.result.push(arbitrageObject);
                    }
                }
            }
        }
    }
}

module.exports = cryptoExchangeArbitrage;
