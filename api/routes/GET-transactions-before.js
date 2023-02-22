const getAccountTxs = (app) => {
    app['get-transactions-before'] = (req, res, headers) => {
        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            txs: []
        }));
    };
};

module.exports = {
    getAccountTxs
};