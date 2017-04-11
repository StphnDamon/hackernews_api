'use strict';

// server, conf and log
const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const config = require('./conf/config');
 
var logger = require('./logger')(__filename);

var hackernewsGraphqlSchema = require('./src/graphql/schema/graphql.schema.url');

// App
const app = express();

const mongodbClient = require('./src/mongodb/mongodb.client');

// Cross Origin Request, needed by hackernews_web
app.use('*', cors({ origin: config.cors.origin }));

// Load mongoose into each request
app.use((req, res, next) => {
    mongodbClient().then(db => {
        req.db = db;
        next();
    }).catch(err => next(new Error(err)));
});

// GraphQL Schema load
app.use('/graphql', (req, res, next) => {logger.debug('new graphql request ...'); next();}, graphqlHTTP({
    schema: hackernewsGraphqlSchema,
    graphiql: config.graphql.graphiql
}));

app.listen(config.server.port);
logger.info('Running on http://localhost:' + config.server.port);
