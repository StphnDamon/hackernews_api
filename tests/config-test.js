var chai = require('chai');
var expect = chai.expect;
var config = require('../conf/config');

describe('config', () => {
    it('config.server.port should equal 8081', () => {
        expect(config.server.port).to.equal(8081);
    });
});
