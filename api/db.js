const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('https://glq-dataseed.graphlinq.io');
const database = require("./database/database")
const BN = Web3.utils.BN;

const numberOftxSave = 50;
const numberOflastTxs = 50;

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
  let models = await database(app);
  
  app.db.account = models.account;
  app.db.lastTxs = models.lastTxs;

  app.db.inProgress = false;

  const processBlocks = async () => {
    if (app.db.inProgress) {
      return;
    }
    app.db.inProgress = true;
    try {
      const latest = await web3.eth.getBlockNumber();
      app.latestBlockNumber = +latest.toString();
    } catch (e) {
      app.db.inProgress = false;
      setTimeout(async () => {
        console.log(`${(new Date()).toString()} retry process db - getBlockNumber`, e);
        await processBlocks();
      }, 1000);
      return ;
    }

    if (isNaN(app.db.currentBlock)) {
      throw new Error(`Invalid block saved in .block database file...`);
    }

    const batchSize = 500;
    const startBlock = app.db.currentBlock + 1;
    const endBlock = Math.min(startBlock + batchSize - 1, app.latestBlockNumber);

    const blocks = [];
    for (let i = startBlock; i <= endBlock; i++) {
      blocks.push(i);
    }

    const batchedBlocks = [];
    const batchSizePerBlock = 50;
    for (let i = 0; i < blocks.length; i += batchSizePerBlock) {
      const batch = blocks.slice(i, i + batchSizePerBlock);
      batchedBlocks.push(batch);
    }

    for (let batch of batchedBlocks) {
      try {
        const promises = batch.map((blockNumber) => web3.eth.getBlock(blockNumber));
        const results = await Promise.all(promises);

        for (let block of results) {
          if (block == undefined || isNaN(block.number)) {
            throw new Error(
              `Invalid block or block Numer from the RPC node, it may be down or flooded`
            );
          }

          updateBlock(block.number); // update .block file

          app.db.currentBlock++;
          console.log(
            `Saving block id ${block.number} (${block.hash}) with ${block.transactions.length} tx(s)`
          );

          const txPromises = block.transactions.map((txHash) =>
            web3.eth.getTransaction(txHash)
          );

          const txs = await Promise.all(txPromises);

          for (let tx of txs) {

            // lastTxs
            let lastTransactions = await new Promise((resolve) => {
              app.db.lastTxs.find({ id: 'lasttransa'}, (err, v) => { 
                if (v.length == 0) {
                  app.db.lastTxs.create({
                    id: 'lasttransa',
                    data: []
                  }, (err) => {
                    app.db.lastTxs.find({ id: 'lasttransa' }, (err, v) => { resolve(v[0]) });
                  });
                } else {
                  resolve(v[0]);
                }
              });
            });

            lastTransactions.data.push({
              ... tx,
              timestamp: block.timestamp
            });
            lastTransactions.data = lastTransactions.data.reverse().slice(0, numberOflastTxs).reverse();
            await new Promise((resolve) => lastTransactions.save(() => { resolve() }));

            // accounts
            let txFromAlreadyExists = await new Promise((resolve) => {
              app.db.account.find({ address: tx.from }, (err, v) => { resolve(v[0]) });
            });
            let txToAlreadyExists = await new Promise((resolve) => {
              app.db.account.find({ address: tx.to }, (err, v) => { resolve(v[0]) });
            });
            if (txFromAlreadyExists == undefined) {
              txFromAlreadyExists = {
                address: tx.from,
                txs: [],
                balance: "0"
              };
              txFromAlreadyExists = await new Promise((resolve) => {
                  app.db.account.create(txFromAlreadyExists, (err) => {
                    console.log(err);
                    app.db.account.find({ address: txFromAlreadyExists.address }, (err, v) => { resolve(v[0]) });
                  });
              });
            }
            if (txToAlreadyExists == undefined) {
              txToAlreadyExists = {
                address: tx.to,
                txs: [],
                balance: "0"
              };
              txToAlreadyExists = await new Promise((resolve) => {
                app.db.account.create(txToAlreadyExists, (err) => {
                  console.log(err);
                  app.db.account.find({ address: txToAlreadyExists.address }, (err, v) => { resolve(v[0]) });
                });
              });
            }

            const newTx = {
              hash: tx.hash,
              timestamp: block.timestamp,
              blockNumber: block.number,
              from: tx.from,
              to: tx.to,
              nonce: tx.nonce,
              input: tx.input.slice(0,10),
              value: tx.value,
              gas: tx.gas,
              gasPrice: tx.gasPrice,
              type: tx.type
            };

            // balances
            txToAlreadyExists.txs.push(newTx);
            txToAlreadyExists.txs = txToAlreadyExists.txs.reverse().slice(0, numberOftxSave).reverse();
            if (txToAlreadyExists.address != txFromAlreadyExists.address) {
              txFromAlreadyExists.txs.push(newTx);
              txFromAlreadyExists.txs = txFromAlreadyExists.txs.reverse().slice(0, numberOftxSave).reverse();
              txToAlreadyExists.balance = (new BN(txToAlreadyExists.balance)).add(new BN(newTx.value)).toString();
              txFromAlreadyExists.balance = (new BN(txFromAlreadyExists.balance)).sub(new BN(newTx.value)).toString();
              await new Promise((resolve) => txToAlreadyExists.save(() => { resolve() }));
              await new Promise((resolve) => txFromAlreadyExists.save(() => { resolve() }));
            } else {
              await new Promise((resolve) => txToAlreadyExists.save(() => { resolve() }));
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    app.db.inProgress = false;

    setTimeout(async () => { // async sub processBlocks
      try {
        await processBlocks();
      } catch (e) { console.log('processBlocks failed'); }
    }, 1);
  };


  try {
    await processBlocks();
  } catch (e) { console.log('processBlocks failed'); }
};

module.exports = {
  db,
};
