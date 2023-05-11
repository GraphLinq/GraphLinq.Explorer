const url = require('url');
const Web3 = require('web3');
const utils = require('ethereumjs-util');
const BlockHeader = require('../static-lib/header');
const { toChecksumAddress } = require('ethereum-checksum-address');
const web3 = new Web3('https://glq-dataseed.graphlinq.io');
const Datastore = require('nedb');
const { get } = require('http');

const getValidator = (app) => {
    app['get-last-transactions'] = async (req, res, headers) => {
        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });
        if (app.db !== undefined && app.db.txs !== undefined) {
            const last50 = app.db.txs.slice(0, 50);
            res.end(JSON.stringify({
                tx: last50
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