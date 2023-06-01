const expect = require('chai').expect;

const {AttributeExpression} = require('./filter_expressions');

describe("FilterExpression", () => {
    it("Can generate a simple search for an account name", () => {
        const filter = new AttributeExpression('sAMAccountName', 'username');
        expect(filter.toString()).to.equal('(sAMAccountName=username)');
    });
});