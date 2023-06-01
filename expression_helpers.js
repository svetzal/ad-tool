const {AttributeExpression} = require("./filter_expressions");

function filterForAccountName(accountName) {
    return new AttributeExpression('sAMAccountName', accountName).toString();
}

function filterForEmail(email) {
    return new AttributeExpression('mail', email).toString();
}

function filterForJobTitleContaining(jobTitle) {
    return new AttributeExpression('title', `*${jobTitle}*`).toString();
}

module.exports = {
    filterForAccountName,
    filterForEmail,
    filterForJobTitleContaining
}