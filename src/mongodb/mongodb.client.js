var mongoose = require('mongoose');
var db = null;
var config = require('../../conf/config.js');

module.exports = () => {
    return new Promise((resolve, reject) => {
        // if db is already initate, no need to connect again
        if (db !== null) {
            resolve(db);
        } else {
            mongoose.connect(config.mongoose.connection.host + '/' + config.mongoose.connection.db);

            db = mongoose.connection;

            db.on('error', error => reject(new Error(error)));

            db.once('open', function() {
                resolve(db);
            });
        }
    });
};
