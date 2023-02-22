const getValidator = (app) => {
    app['get-validator'] = (req, res) => {
        res.sendStatus(200);
    };
};

module.exports = {
    getValidator
};