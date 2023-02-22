const getValidator = (app) => {
    app['get-validator'] = (req, res, headers) => {

        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            validator: 'GraphLinq Nodes'
        }));
    };
};

module.exports = {
    getValidator
};