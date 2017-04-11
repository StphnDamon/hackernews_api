var logger = require('../../../logger')(__filename);
var makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
var GraphqlResolverUrl = require('../resolver/graphql.resolver.url');
var Url = require('../../mongodb/schema/mongodb.schema.url');

const resolvers = new GraphqlResolverUrl({ Url });

const typeDefs = `
type Url {
   _id: ID!
   url: String!
   title: String!
   vote: Vote!
}

type Vote {
    up: Int!
    down: Int!
    total: Int!
}

type Query {
   urls: [Url]
}

type Mutation {
    addUrl(url: String!): Url
    voteUp(_id: String!): Url
    voteDown(_id: String!): Url
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
