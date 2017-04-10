var chai = require('chai');
var sinonChai = require("sinon-chai");
var sinon = require("sinon");
require('sinon-mongoose');
var expect = chai.expect;

var GraphqlResolverUrl = require('../../../src/graphql/resolver/graphql.resolver.url');
var mongoose = require('mongoose');
var Url = require('../../../src/graphql/schema/graphql.schema.url');


chai.use(sinonChai);

describe('GraphQL Resolver Url', () => {
    var graphqlResolverUrl;

    beforeEach(() => {
        graphqlResolverUrl = new GraphqlResolverUrl();
    });

    it('Instanceof GraphqlResolverUrl must return a Schema', () => {
        expect(graphqlResolverUrl.Query).to.deep.equal({
            urls: async (root, args, req) => {
                var test = await this.resolveUrls(root, args, req);

                return test;
            }
        });

        expect(graphqlResolverUrl.Mutation).to.deep.equal({
            addUrl: async (root, args, req) => {
                var url = await this.addUrl(root, args, req);

                return true;
            }
        });
    });

    describe('Query.urls part', () => {
        it('graphqlResolverUrl.Query.urls must call resolverUrls', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'resolveUrls');

            var urls = await graphqlResolverUrl.Query.urls({}, {}, {});

            expect(graphqlResolverUrl.resolveUrls).to.have.been.calledOnce;
        });

        it('graphqlResolverUrl.Query.urls must return resolverUrls return', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'resolveUrls');
            var resolverUrlsReturns = [
                {
                    url: 'http://google.fr'
                },
                {
                    url: 'http://bing.com'
                }
            ];

            stub.returns(resolverUrlsReturns);

            var urls = await graphqlResolverUrl.Query.urls({}, {}, {});

            expect(urls).to.deep.equal(resolverUrlsReturns);
        });
    });

    describe('Mutation.addUrl part', () => {
        it('graphqlResolverUrl.Mutation.addUrl must call addUrl', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'addUrl');

            var urls = await graphqlResolverUrl.Mutation.addUrl({}, {}, {});

            expect(graphqlResolverUrl.addUrl).to.have.been.calledOnce;
        });

        it('graphqlResolverUrl.Mutation.addUrl must return resolverUrls return', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'addUrl');
            var resolverUrlsReturns = {
                url: 'http://google.fr'
            };

            stub.returns(resolverUrlsReturns);

            var urls = await graphqlResolverUrl.Mutation.addUrl({}, {}, {});

            expect(urls).to.deep.equal(resolverUrlsReturns);
        });
    });

    describe('resolveUrls part', () => {
        it('graphqlResolverUrl.resolveUrls use Promise', async () => {
            var resolverUrlsReturns = [
                {
                    url: 'http://google.fr'
                },
                {
                    url: 'http://bing.com'
                }
            ];

            var urlSchema = {find: function (data, callback) {
                callback(null, resolverUrlsReturns);
            }};

            var req = {
                db: {
                    model: function () {}
                }
            };

            var urlSpy = sinon.spy(urlSchema, 'find');
            var modelStub = sinon.stub(req.db, 'model');

            modelStub.returns(urlSchema);

            var result = graphqlResolverUrl.resolveUrls({}, {}, req);

            expect(req.db.model).to.have.been.calledOnce;
            expect(req.db.model).to.have.been.calledWith('url');
            expect(urlSchema.find).to.have.been.calledOnce;

            return result.then(function(data) {
                expect(data).to.deep.equal(resolverUrlsReturns);
            });
        });
    });

    describe('addUrl part', () => {
        it('graphqlResolverUrl.addUrl use Promise', async () => {
            var url = 'http://google.fr';

            var resolverUrlsReturns = {
                url: url
            };            

            var saveFunction = function (callback) {
                callback(null, resolverUrlsReturns);
            };

            var urlSpy = sinon.spy(saveFunction);

            var urlSchema = function () {
                return {
                    save: urlSpy
                }
            };

            var req = {
                db: {
                    model: function () {}
                }
            };

            var schemaSpy = sinon.spy(urlSchema);
            var modelStub = sinon.stub(req.db, 'model');

            modelStub.returns(schemaSpy);

            var result = graphqlResolverUrl.addUrl({}, { url }, req);

            expect(req.db.model).to.have.been.calledOnce;
            expect(req.db.model).to.have.been.calledWith('url');
            expect(schemaSpy).to.have.been.calledOnce;
            expect(schemaSpy).to.have.been.calledWith({ url });
            expect(urlSpy).to.have.been.calledOnce;

            return result.then(function(data) {
                expect(data).to.deep.equal(resolverUrlsReturns);
            });
        });
    });
});
