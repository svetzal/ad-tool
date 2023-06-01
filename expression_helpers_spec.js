const {filterForAccountName, filterForEmail, filterForJobTitleContaining} = require("./expression_helpers");
const expect = require('chai').expect;

describe("FilterExpression", () => {

    describe("filterForAccountName", () => {
        it("Can generate a simple search for an account name", () => {
            let accountName = 'username';
            const filter = filterForAccountName(accountName);
            expect(filter).to.equal(`(sAMAccountName=${accountName})`);
        });
    });

    describe("filterForEmail", () => {
        it("Can generate a simple search for an email", () => {
            let email = 'test@example.com';
            const filter = filterForEmail(email);
            expect(filter).to.equal(`(mail=${email})`);
        });
    });

    describe("filterForJobTitleContaining", () => {
        it("Can generate a simple search for a job title", () => {
            let jobTitle = 'Developer';
            const filter = filterForJobTitleContaining(jobTitle);
            expect(filter).to.equal(`(title=*${jobTitle}*)`);
        });
    });

});

