'use strict';

module.exports = function(app, db) {
    return db.define("account", {
        address       : { type: 'text', size: 42, key: true },
        txs           : { type: 'text', big: true, defaultValue: "[]" },
        balance       : { type: 'text', big: true, defaultValue: "0" }
    }, {
        hooks: {
            beforeCreate: function (next) {
                if (typeof this.txs != 'string') {
                    this.txs = JSON.stringify(this.txs);
                }
                return next();
            },
            beforeSave: function (next) {
                if (typeof this.txs != 'string') {
                    this.txs = JSON.stringify(this.txs);
                }
                return next();
            },
            afterLoad: function (next) {
                if (typeof this.txs == 'string') {
                    this.txs = JSON.parse(this.txs);
                }
                return next();
            }
        },
        methods: {},
        validations: {}
    });
};