const getAccountTxs = (app) => {
    app['get-transactions-after'] = (req, res, headers) => {
        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify([{
            txs: []
        }]));
    };
};

module.exports = {
    getAccountTxs
};