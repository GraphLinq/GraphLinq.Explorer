'use strict';

const orm = require("orm");
const AccountModel = require("./models/account");
const LastTxsModel = require("./models/last-txs");

/**
 *  https://github.com/dresende/node-orm2
 */
module.exports = async function(app) {

    return new Promise((resolve) => {
        orm.express("sqlite://./db?pool=true", {
            define: function (db, models) {
                console.log(db, models);
                models.account = AccountModel(orm, db);
                models.lastTxs = LastTxsModel(orm, db);

                app.models = models;
                [
                    [models.account, 'account'],
                    [models.lastTxs, 'lastTxs'],
                    [undefined, undefined]
                ].forEach((model) => {
                    if (model[0] == undefined) {
                        resolve(models);
                        return ;
                    }
                    model[0].syncPromise((x) => {
                        if (x) console.error(x);
                    })
                });
            }
        });
    });
};