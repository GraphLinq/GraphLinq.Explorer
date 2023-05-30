'use strict';

module.exports = function(app, db) {
    return db.define("last-txs", {
        id         : { type: 'text', size: 10, key: true },
        data       : { type: 'text', big: true, defaultValue: "[]" }
    }, {
        hooks: {
            beforeCreate: function (next) {
                if (typeof this.data != 'string') {
                    this.data = JSON.stringify(this.data);
                }
                return next();
            },
            beforeSave: function (next) {
                if (typeof this.data != 'string') {
                    this.data = JSON.stringify(this.data);
                }
                return next();
            },
            afterLoad: function (next) {
                if (typeof this.data == 'string') {
                    this.data = JSON.parse(this.data);
                }
                return next();
            }
        },
        methods: {},
        validations: {}
    });
};