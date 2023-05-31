const expect = require('chai').expect;

const index = require('./core');
describe('index.js', () => {
    it('should exist', () => {
        expect(index).to.exist;
    });
});