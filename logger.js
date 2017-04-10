"use strict";
var util = require('util');

module.exports = (filename) => {
    var log4js = require('log4js');
    var log_f = filename.split('/').reverse().slice(0, 3).reverse().join('/');

    log4js.configure();
    var logger = log4js.getLogger(log_f);

    logger.util = function () {
        var tmpArray = [];

        for (var index in arguments) {
            logger.debug(util.inspect(arguments[index], {colors: true, showHidden: true, depth: 5}));
        }
    };

    return logger;
};
