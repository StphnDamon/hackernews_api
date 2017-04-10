var mongoose = require('mongoose');

var urlSchema = mongoose.Schema({
    url: String,
    title: String,
    vote: {
        up: {type: Number, default: 0},
        down: {type: Number, default: 0},
        total: {type: Number, default: 0}
    }
});

var Url = mongoose.model('url', urlSchema);

module.exports = Url;