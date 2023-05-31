const url = require('url');
const Web3 = require('web3');
const utils = require('ethereumjs-util');
const BlockHeader = require('../static-lib/header');
const { toChecksumAddress } = require('ethereum-checksum-address');
const web3 = new Web3('https://glq-dataseed.graphlinq.io');
const Datastore = require('nedb');
const { get } = require('http');

async function getLastTxs(app) {
    return new Promise((resolve,rej) => {
        app.db.lastTxs.find({ id: 'lasttransa' }, (err, v) => { resolve(v[0]) });
        // app.db.txs.find({ blockNumber: { $gt: app.db.currentBlock - 5000 } }).sort({ blockNumber: -1 }).exec((err, docs) => resolve(docs));
    })
}

const getValidator = (app) => {
    app['get-last-transactions'] = async (req, res, headers) => {
        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });
        if (app.db !== undefined) {
            const last50 = (await getLastTxs(app));
            res.end(JSON.stringify({
                tx: last50 ? last50.data.reverse() : []
            }));
        } else {
            res.end(JSON.stringify({
                tx: []
            }));
        }
    };
};

module.exports = {
    getValidator
};