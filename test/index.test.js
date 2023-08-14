const expect = require('chai').expect;
const index = require('../index');

describe('sample test', function() {
    it('should print "Hello World"', function() {
        expect(index()).to.equal('Hello World');
    });
});