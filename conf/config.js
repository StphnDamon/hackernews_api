module.exports = {
    server : {
        port: 8081
    },
    logger: {
        appenders: [
            {
                type: 'console',
                layout: {
                    type: 'pattern',
                    pattern: '%[[%d] [%p] [%c]%x%] - %m%n'
                }
            },
            {
                type: 'dateFile',
                layout: {
                    type: 'pattern',
                    pattern: '[%[%d] [%p] [%c]%x%] - %m%n'
                },
                filename: '/app/logs/api/api.extranet.log',
                pattern: "-yyyy-MM-dd",
                alwaysIncludePattern: true
            }
        ],
        replaceConsole: true
    }
};

//module.exports = config;