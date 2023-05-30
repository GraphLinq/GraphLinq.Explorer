const fs = require('fs');

const localDB = (filePath) => {

    const db = {};

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]');
    }
    db.data = JSON.parse((fs.readFileSync(filePath)).toString());

    db.updated = false;
    db.save = () => {
        if (db.updated) {
            fs.writeFileSync(filePath, JSON.stringify(db.data));
            db.updated = false;
        }
    };

    return db;
};

module.exports = {
    localDB
};