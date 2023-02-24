const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('https://glq-dataseed.graphlinq.io');
const Datastore = require('nedb')

const db = async (app) => {

    app.db = {};
    if (fs.existsSync('.block')) {
        app.db.currentBlock = +fs.readFileSync('.block').toString();
    } else {
        app.db.currentBlock = 0;
    }
    const updateBlock = (block) => {
        fs.writeFileSync('.block', `${block}`);
    };
    app.db.blocks = new Datastore('.blocks.db');
    app.db.txs = new Datastore('.txs.db');

    await new Promise((cb) => app.db.blocks.loadDatabase(cb));
    await new Promise((cb) => app.db.txs.loadDatabase(cb));

    app.db.inProgress = false;
    setInterval(async () => {
        if (app.db.inProgress) {
            return ;
        }
        app.db.inProgress = true;
        const latest = await web3.eth.getBlockNumber();
        app.latestBlockNumber = +latest.toString();

        if (app.db.currentBlock < app.latestBlockNumber) {
            const block = await web3.eth.getBlock(app.db.currentBlock++);
            updateBlock(block.number); // update .block file

            let alreadyExists = await new Promise((resolve) => app.db.blocks.findOne({ number: block.number }, (err, doc) => resolve(doc)));
            if (!alreadyExists) {
                // insert block
                await new Promise((resolve) => app.db.blocks.insert(block, (err, newDoc) => resolve(newDoc)));
            } else {
                app.db.inProgress = false;
                return ;
            }

            console.log(block.number, block.transactions.length);

            for (let tx_hash of block.transactions) {
                const tx = await web3.eth.getTransaction(tx_hash);

                let txAlreadyExists = await new Promise((resolve) => app.db.txs.findOne({ hash: tx.hash }, (err, doc) => resolve(doc)));
                if (!txAlreadyExists) {
                    // insert block
                    await new Promise((resolve) => app.db.txs.insert(tx, (err, newDoc) => resolve(newDoc)));
                }
            }
        }


        app.db.inProgress = false;
    }, 100);

};

module.exports = {
    db
};