const url = require('url');
const Web3 = require('web3');
const utils = require('ethereumjs-util');
const BlockHeader = require('../static-lib/header');
const { toChecksumAddress } = require('ethereum-checksum-address');
const web3 = new Web3('https://glq-dataseed.graphlinq.io');
const Datastore = require('nedb');
const { get } = require('http');


let db = undefined

async function getDb() {
    if (db === undefined) {
        db = {}
    db.blocks = new Datastore('.blocks.db');
    db.txs = new Datastore('.txs.db');

    await new Promise((cb) => db.blocks.loadDatabase(cb));
    await new Promise((cb) => db.txs.loadDatabase(cb));

    db.txsData = await getTxs(db);
    db.blocksData = await getBlocks(db);

    setInterval(async () => {
        await new Promise((cb) => db.blocks.loadDatabase(cb));
        await new Promise((cb) => db.txs.loadDatabase(cb));
        db.txsData = await getTxs(db);
        db.blocksData = await getBlocks(db);
        console.log(`db data refreshed`)
    }, 5000)

    }
    else return db;
}

async function getBlocks(db) {
    return new Promise((resolve,rej) => {
        db.txs.find({}).sort({ blockNumber: -1 }).exec((err, docs) => resolve(docs));
    })
}

async function getTxs(db) {
    return new Promise((resolve,rej) => {
        db.txs.find({}).sort({ blockNumber: -1 }).exec((err, docs) => resolve(docs));
    })
}


const getValidator = (app) => {
    app['get-last-transactions'] = async (req, res, headers) => {
        const db = await getDb();


        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });
        if (db !== undefined && db.txsData) {
            const last50 = db.txsData.slice(0, 50);
            res.end(JSON.stringify({
                tx: last50
            }));
        } else {
            res.end(JSON.stringify({
            
            }));
        }
    };
};

module.exports = {
    getValidator
};