var mongoose = require('mongoose');
var db = null;

module.exports = () => {
    return new Promise((resolve, reject) => {
        if (db !== null) {
            resolve(db);
        } else {
            mongoose.connect('mongodb://localhost/hackernews');

            db = mongoose.connection;

            db.on('error', error => reject(new Error(error)));

            db.once('open', function() {
                resolve(db);
            });
        }
    });
};
