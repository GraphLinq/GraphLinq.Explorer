const url = require('url');

const getAccountTxs = (app) => {
    app['get-transactions-before'] = async (req, res, headers) => {
        const urlObj = url.parse( req.url, true, false );
        const address = urlObj.query['address'];
        const baseblock = urlObj.query['baseblock'] == '0' ? '10000000000000' : urlObj.query['baseblock'];
        const size = urlObj.query['size'];

        // let transactions = await new Promise((resolve) => {
        //     app.db.txs.find({
        //         $or: [
        //             { from: address, blockNumber: { $lt: +baseblock } },
        //             { to: address, blockNumber: { $lt: +baseblock } }
        //         ]
        //     }).sort({ blockNumber: -1 }).limit(+size).exec((err, docs) => resolve(docs));
        // });

        const account = await new Promise((resolve) => app.db.account.find({ address: address }, (err, v) => { resolve(v[0]) }));

        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });
        
        res.end(JSON.stringify({
            txs: account ? account.txs.reverse() : []
        }));
    };
};

module.exports = {
    getAccountTxs
};
