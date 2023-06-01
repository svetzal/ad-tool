const expect = require('chai').expect;

const {AttributeExpression, FilterExpression, AndExpression, NotExpression} = require('./filter_expressions');

describe("FilterExpression", () => {
    it("Can generate a simple search for an account name", () => {
        const filter = new AttributeExpression('sAMAccountName', 'username');
        expect(filter.toString()).to.equal('(sAMAccountName=username)');
    });

    it("Can generate a more complex filter expression", () => {
        const filter = new AndExpression(
            new AttributeExpression('title', '*developer*'),
            new NotExpression(
                new AttributeExpression('company', 'Acme')
            )
        );
        expect(filter.toString()).to.equal('(&(title=*developer*)(!(company=Acme)))');
    });
});