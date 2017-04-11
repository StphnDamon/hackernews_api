var logger = require('../../../logger')(__filename);
var chai = require('chai');
var sinonChai = require("sinon-chai");
var sinon = require("sinon");
require('sinon-mongoose');
var expect = chai.expect;

var mongoose = require('mongoose');
var Url = require('../../../src/graphql/schema/graphql.schema.url');

chai.use(sinonChai);

describe('GraphQL Resolver Url', () => {
    var graphqlResolverUrl;

    beforeEach(() => {
        var GraphqlResolverUrl = require('../../../src/graphql/resolver/graphql.resolver.url');
        graphqlResolverUrl = new GraphqlResolverUrl();
    });

    it('Instanceof GraphqlResolverUrl must return a Schema',async  () => {
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
            },
            voteUp: async (root, args, req) => {
                var result = await this.voteUp(root, args, req);

                return result;
            },
            voteDown: async (root, args, req) => {
                var result = await this.voteDown(root, args, req);

                return result;
            }
        });
    });

    describe('Query.urls part', () => {
        it('Query.urls must call resolverUrls', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'resolveUrls');

            var urls = await graphqlResolverUrl.Query.urls({}, {}, {});

            expect(graphqlResolverUrl.resolveUrls).to.have.been.calledOnce;
        });

        it('Query.urls must return resolverUrls return', async () => {
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
        it('Mutation.addUrl must call addUrl', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'addUrl');

            var urls = await graphqlResolverUrl.Mutation.addUrl({}, {}, {});

            expect(graphqlResolverUrl.addUrl).to.have.been.calledOnce;
        });

        it('Mutation.addUrl must return resolverUrls return', async () => {
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
        it('resolveUrls use Promise', () => {
            var dataReturns = [
                {
                    url: 'http://google.fr'
                },
                {
                    url: 'http://bing.com'
                }
            ];

            // mongoose final exec
            var execFunction = function (callback) {
                callback(null, dataReturns);
            };

            var execFunctionSpy = sinon.spy(execFunction);

            // mongoose sort
            var sortFunction = function () {
                return {
                    exec: execFunctionSpy
                };
            };

            var sortFunctionSpy = sinon.spy(sortFunction);

            // mongoose find
            var urlModel = {find: function () {
                return {
                    sort: sortFunctionSpy
                };
            }};

            // mongoose model retrieve
            var req = {
                db: {
                    model: function () {}
                }
            };

            var urlSpy = sinon.spy(urlModel, 'find');
            var modelStub = sinon.stub(req.db, 'model');

            modelStub.returns(urlModel);

            // resolveUrls execution
            var result = graphqlResolverUrl.resolveUrls({}, {}, req);

            // mongoose final exec
            expect(execFunctionSpy).to.have.been.calledOnce;

            // mongoose sort
            expect(sortFunctionSpy).to.have.been.calledOnce;
            expect(sortFunctionSpy).to.have.been.calledWith({ 'vote.total': -1 });

            // mongoose find
            expect(urlModel.find).to.have.been.calledOnce;
            expect(urlModel.find).to.have.been.calledWith({});

            // mongoose model retrieve
            expect(req.db.model).to.have.been.calledOnce;
            expect(req.db.model).to.have.been.calledWith('url');

            return result.then(function(data) {
                expect(data).to.deep.equal(dataReturns);
            });
        });

        it('resolveUrls reject mongoose error', () => {
            var errMessage = 'Error Message';
            // mongoose final exec
            var execFunction = function (callback) {
                callback(errMessage);
            };

            var execFunctionSpy = sinon.spy(execFunction);

            // mongoose sort
            var sortFunction = function () {
                return {
                    exec: execFunctionSpy
                };
            };

            var sortFunctionSpy = sinon.spy(sortFunction);

            // mongoose find
            var urlModel = {find: function () {
                return {
                    sort: sortFunctionSpy
                };
            }};

            // mongoose model retrieve
            var req = {
                db: {
                    model: function () {}
                }
            };

            var urlSpy = sinon.spy(urlModel, 'find');
            var modelStub = sinon.stub(req.db, 'model');

            modelStub.returns(urlModel);

            // resolveUrls execution
            var result = graphqlResolverUrl.resolveUrls({}, {}, req);

            // mongoose final exec
            expect(execFunctionSpy).to.have.been.calledOnce;

            // mongoose sort
            expect(sortFunctionSpy).to.have.been.calledOnce;
            expect(sortFunctionSpy).to.have.been.calledWith({ 'vote.total': -1 });

            // mongoose find
            expect(urlModel.find).to.have.been.calledOnce;
            expect(urlModel.find).to.have.been.calledWith({});

            // mongoose model retrieve
            expect(req.db.model).to.have.been.calledOnce;
            expect(req.db.model).to.have.been.calledWith('url');

            return result.then(function(data) {
                throw new Error('this should not be called');
            }).catch(err => {
                expect(err.message).to.equal(errMessage);
            });
        });
    });

    describe('addUrl part', () => {
        it('addUrl use Promise', () => {
            var url = 'google.fr';
            var title = 'Google Site';

            var resolverUrlsReturns = { url: 'http://' + url, title };

            // mongoose save final function
            var saveFunction = function (callback) {
                callback(null, resolverUrlsReturns);
            };

            var saveFunctionSpy = sinon.spy(saveFunction);

            // mongoose model
            var urlModel = function () {
                return {
                    save: saveFunctionSpy
                }
            };

            // mongoose model retrieve
            var req = {
                db: {
                    model: function () {}
                }
            };

            var modelStub = sinon.stub(req.db, 'model');

            var urlModelSpy = sinon.spy(urlModel);

            modelStub.returns(urlModelSpy);

            var requestFake = function (link, callback) {
                callback(null, null, '<head><title>' + title + '</title></head>...');
            };

            var requestFakeSpy = sinon.spy(requestFake);

            var result = graphqlResolverUrl.addUrl(requestFakeSpy, {}, { url }, req);

            // mongoose model retrieve
            expect(modelStub).to.have.been.calledOnce;
            expect(modelStub).to.have.been.calledWith('url');

            // request
            expect(requestFakeSpy).to.have.been.calledOnce;
            
            // mongoose model init with data
            expect(urlModelSpy).to.have.been.calledOnce;
            expect(urlModelSpy).to.have.been.calledWith({ url: 'http://' + url, title });

            // mongoose model save
            expect(saveFunctionSpy).to.have.been.calledOnce;

            return result.then(function(data) {
                expect(data).to.deep.equal(resolverUrlsReturns);
            });
        });

        it('addUrl reject "site do not have a title"', () => {
            var url = 'google.fr';
            var title = 'Google Site';
            var errMessage = 'This site do not have a title';

            var resolverUrlsReturns = { url: 'http://' + url, title };

            // mongoose save final function
            var saveFunction = function (callback) {
                callback(null, resolverUrlsReturns);
            };

            var saveFunctionSpy = sinon.spy(saveFunction);

            // mongoose model
            var urlModel = function () {
                return {
                    save: saveFunctionSpy
                }
            };

            // mongoose model retrieve
            var req = {
                db: {
                    model: function () {}
                }
            };

            var modelStub = sinon.stub(req.db, 'model');

            var urlModelSpy = sinon.spy(urlModel);

            modelStub.returns(urlModelSpy);

            var requestFake = function (link, callback) {
                callback(null, null, '<head>' + title + '</title></head>...');
            };

            var requestFakeSpy = sinon.spy(requestFake);

            var result = graphqlResolverUrl.addUrl(requestFakeSpy, {}, { url }, req);

            // mongoose model retrieve
            expect(modelStub).to.have.been.notCalled;

            // request
            expect(requestFakeSpy).to.have.been.calledOnce;
            
            // mongoose model init with data
            expect(urlModelSpy).to.have.been.notCalled;

            // mongoose model save
            expect(saveFunctionSpy).to.have.been.notCalled;

            return result.then(function(data) {
                throw new Error('This should not be called');
            }).catch(err => {
                expect(err.message).to.equal(errMessage);
            });
        });

        it('addUrl reject request error', () => {
            var url = 'google.fr';
            var title = 'Google Site';
            var errMessage = 'Request error message';

            var resolverUrlsReturns = { url: 'http://' + url, title };

            // mongoose save final function
            var saveFunction = function (callback) {
                callback(null, resolverUrlsReturns);
            };

            var saveFunctionSpy = sinon.spy(saveFunction);

            // mongoose model
            var urlModel = function () {
                return {
                    save: saveFunctionSpy
                }
            };

            // mongoose model retrieve
            var req = {
                db: {
                    model: function () {}
                }
            };

            var modelStub = sinon.stub(req.db, 'model');

            var urlModelSpy = sinon.spy(urlModel);

            modelStub.returns(urlModelSpy);

            var requestFake = function (link, callback) {
                callback(errMessage);
            };

            var requestFakeSpy = sinon.spy(requestFake);

            var result = graphqlResolverUrl.addUrl(requestFakeSpy, {}, { url }, req);

            // mongoose model retrieve
            expect(modelStub).to.have.been.notCalled;

            // request
            expect(requestFakeSpy).to.have.been.calledOnce;
            
            // mongoose model init with data
            expect(urlModelSpy).to.have.been.notCalled;

            // mongoose model save
            expect(saveFunctionSpy).to.have.been.notCalled;

            return result.then(function(data) {
                throw new Error('This should not be called');
            }).catch(err => {
                expect(err.message).to.equal(errMessage);
            });
        });

        it('addUrl reject save error', () => {
            var url = 'google.fr';
            var title = 'Google Site';
            var errMessage = 'Save error message';

            var resolverUrlsReturns = { url: 'http://' + url, title };

            // mongoose save final function
            var saveFunction = function (callback) {
                callback(errMessage);
            };

            var saveFunctionSpy = sinon.spy(saveFunction);

            // mongoose model
            var urlModel = function () {
                return {
                    save: saveFunctionSpy
                }
            };

            // mongoose model retrieve
            var req = {
                db: {
                    model: function () {}
                }
            };

            var modelStub = sinon.stub(req.db, 'model');

            var urlModelSpy = sinon.spy(urlModel);

            modelStub.returns(urlModelSpy);

            var requestFake = function (link, callback) {
                callback(null, null, '<head><title>' + title + '</title></head>...');
            };

            var requestFakeSpy = sinon.spy(requestFake);

            var result = graphqlResolverUrl.addUrl(requestFakeSpy, {}, { url }, req);

            // mongoose model retrieve
            expect(modelStub).to.have.been.calledOnce;

            // request
            expect(requestFakeSpy).to.have.been.calledOnce;
            
            // mongoose model init with data
            expect(urlModelSpy).to.have.been.calledOnce;

            // mongoose model save
            expect(saveFunctionSpy).to.have.been.calledOnce;

            return result.then(function(data) {
                throw new Error('This should not be called');
            }).catch(err => {
                expect(err.message).to.equal(errMessage);
            });
        });
    });

    describe('Mutation.vote[Up|Down] part', () => {
        it('Mutation.voteUp must call voteUp', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'voteUp');

            var urls = await graphqlResolverUrl.Mutation.voteUp({}, {}, {});

            expect(graphqlResolverUrl.voteUp).to.have.been.calledOnce;
        });

        it('Query.voteUp must return voteUp return', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'voteUp');
            var id = '_FRFOFefoefe244';

            var resolverUrlsReturns = {
                _id: id
            };

            stub.returns(resolverUrlsReturns);

            var urls = await graphqlResolverUrl.Mutation.voteUp({}, { _id: id }, {});

            expect(urls).to.deep.equal(resolverUrlsReturns);
        });

        it('Mutation.voteDown must call votDown', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'voteDown');

            var urls = await graphqlResolverUrl.Mutation.voteDown({}, {}, {});

            expect(graphqlResolverUrl.voteDown).to.have.been.calledOnce;
        });

        it('Query.voteDown must return voteDown return', async () => {
            var stub = sinon.stub(graphqlResolverUrl, 'voteDown');
            var id = '_FRFOFefoefe244';

            var resolverUrlsReturns = {
                _id: id
            };

            stub.returns(resolverUrlsReturns);

            var urls = await graphqlResolverUrl.Mutation.voteDown({}, { _id: id }, {});

            expect(urls).to.deep.equal(resolverUrlsReturns);
        });
    });

    describe('vote[Up|Down] part', () => {
        it('voteUp use promise', () => {
            var _id = '_fakeid';

            // mongoose update function
            var updateFunction = function ({}, {}, callback) {
                callback(null, {});
            };

            var updateFunctionSpy = sinon.spy(updateFunction);

            // mongoose model
            var urlModel = {
                update: updateFunctionSpy
            };

            var req = { db: { model: function () {} } };

            var modelStub = sinon.stub(req.db, 'model');

            modelStub.returns(urlModel);

            // exec function
            var result = graphqlResolverUrl.voteUp( {}, { _id }, req);

            // mongoose model retrieve
            expect(modelStub).to.have.been.calledOnce;
            expect(modelStub).to.have.been.calledWith('url');

            // mongoose update call
            expect(updateFunctionSpy).to.have.been.calledOnce;
            expect(updateFunctionSpy).to.have.been.calledWith({ _id }, {$inc: {'vote.up': 1, 'vote.total': 1}});

            // voteUp return
            result.then(data => {
                expect(data).to.deep.equal({ _id });
            });
        });

        it('voteUp reject update error', () => {
            var _id = '_fakeid';
            var errMessage = 'voteUp update error';

            // mongoose update function
            var updateFunction = function ({}, {}, callback) {
                callback(errMessage);
            };

            var updateFunctionSpy = sinon.spy(updateFunction);

            // mongoose model
            var urlModel = {
                update: updateFunctionSpy
            };

            var req = { db: { model: function () {} } };

            var modelStub = sinon.stub(req.db, 'model');

            modelStub.returns(urlModel);

            // exec function
            var result = graphqlResolverUrl.voteUp( {}, { _id }, req);

            // mongoose model retrieve
            expect(modelStub).to.have.been.calledOnce;
            expect(modelStub).to.have.been.calledWith('url');

            // mongoose update call
            expect(updateFunctionSpy).to.have.been.calledOnce;
            expect(updateFunctionSpy).to.have.been.calledWith({ _id }, {$inc: {'vote.up': 1, 'vote.total': 1}});

            // voteUp return
            result.then(data => {
                throw new Error('this should not be called');
            }).catch(err => {
                expect(err.message).to.equal(errMessage);
            });
        });

        it('voteDown use promise', () => {
            var _id = '_fakeid';

            // mongoose update function
            var updateFunction = function ({}, {}, callback) {
                callback(null, {});
            };

            var updateFunctionSpy = sinon.spy(updateFunction);

            // mongoose model
            var urlModel = {
                update: updateFunctionSpy
            };

            var req = { db: { model: function () {} } };

            var modelStub = sinon.stub(req.db, 'model');

            modelStub.returns(urlModel);

            // exec function
            var result = graphqlResolverUrl.voteDown( {}, { _id }, req);

            // mongoose model retrieve
            expect(modelStub).to.have.been.calledOnce;
            expect(modelStub).to.have.been.calledWith('url');

            // mongoose update call
            expect(updateFunctionSpy).to.have.been.calledOnce;
            expect(updateFunctionSpy).to.have.been.calledWith({ _id }, {$inc: {'vote.down': 1, 'vote.total': -1}});

            // voteUp return
            result.then(data => {
                expect(data).to.deep.equal({ _id });
            });
        });

        it('voteDown reject update error', () => {
            var _id = '_fakeid';
            var errMessage = 'voteDown update error';

            // mongoose update function
            var updateFunction = function ({}, {}, callback) {
                callback(errMessage);
            };

            var updateFunctionSpy = sinon.spy(updateFunction);

            // mongoose model
            var urlModel = {
                update: updateFunctionSpy
            };

            var req = { db: { model: function () {} } };

            var modelStub = sinon.stub(req.db, 'model');

            modelStub.returns(urlModel);

            // exec function
            var result = graphqlResolverUrl.voteDown( {}, { _id }, req);

            // mongoose model retrieve
            expect(modelStub).to.have.been.calledOnce;
            expect(modelStub).to.have.been.calledWith('url');

            // mongoose update call
            expect(updateFunctionSpy).to.have.been.calledOnce;
            expect(updateFunctionSpy).to.have.been.calledWith({ _id }, {$inc: {'vote.down': 1, 'vote.total': -1}});

            // voteUp return
            result.then(data => {
                throw new Error('this should not be called');
            }).catch(err => {
                expect(err.message).to.equal(errMessage);
            });
        });
    });
});
