module.exports = {
    cors: {
        origin: 'http://localhost:3000'
    },
    graphql: {
        graphiql: true
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
    },
    mongoose: {
        connection: {
            db: 'hackernews',
            host: 'mongodb://localhost'
        }
    },
    server : {
        port: 8081
    }
};