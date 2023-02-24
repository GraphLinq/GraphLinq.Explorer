const url = require('url');

const getAccountTxs = (app) => {
    app['get-transactions-after'] = async (req, res, headers) => {
        const urlObj = url.parse( req.url, true, false );
        const address = urlObj.query['address'];
        const baseblock = urlObj.query['baseblock'] == '0' ? '10000000000000' : urlObj.query['baseblock'];
        const size = urlObj.query['size'];

        let transactions = await new Promise((resolve) => {
            app.db.txs.find({
                $or: [
                    { from: address, blockNumber: { $gt: +baseblock } },
                    { to: address, blockNumber: { $gt: +baseblock } }
                ]
            }).sort({ blockNumber: -1 }).limit(+size).exec((err, docs) => resolve(docs));
        });

        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            txs: transactions
        }));
    };
};

module.exports = {
    getAccountTxs
};