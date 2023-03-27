const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('https://glq-dataseed.graphlinq.io');
const Datastore = require('nedb');

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
              `Invalid block ${block.number} from the RPC node, it may be down or flooded`
            );
          }

          updateBlock(block.number); // update .block file

          app.db.currentBlock++;
          let alreadyExists = await new Promise((resolve) =>
            app.db.blocks.findOne({ number: block.number }, (err, doc) =>
              resolve(doc)
            )
          );
          if (!alreadyExists) {
            // insert block
            await new Promise((resolve) =>
              app.db.blocks.insert(block, (err, newDoc) => resolve(newDoc))
            );
          }

          console.log(
            `Saving block id ${block.number} (${block.hash}) with ${block.transactions.length} tx(s)`
          );

          const txPromises = block.transactions.map((txHash) =>
            web3.eth.getTransaction(txHash)
          );

          const txs = await Promise.all(txPromises);

          for (let tx of txs) {
            let txAlreadyExists = await new Promise((resolve) =>
              app.db.txs.findOne({ hash: tx.hash }, (err, doc) => resolve(doc))
            );
            if (!txAlreadyExists) {
              // insert transaction
              await new Promise((resolve) => {
                tx.timestamp = block.timestamp
                app.db.txs.insert(tx, (err, newDoc) => resolve(newDoc))
              });
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
