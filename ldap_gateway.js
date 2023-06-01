const keytar = require("keytar");
const ldap = require("ldapjs");
const {filterForAccountName} = require("./expression_helpers");
const base_dn = 'dc=example,dc=com';

async function getClient() {
    const service = 'ActiveDirectoryService';
    const account = process.env.USERNAME;
    const password = await keytar.getPassword(service, account);

    let client = ldap.createClient({
        url: 'ldap://example.com' // Put your Active Directory URL here
    });

    client.bind(account, password, err => {
        if (err) {
            console.error('Error binding to LDAP:', err);
            exit(1);
        }
    });

    return client;
}


async function getEmailAndGroups(username) {

    return new Promise((resolve, reject) => {
        const opts = {
            filter: filterForAccountName(),
            scope: 'sub',
            attributes: ['mail', 'memberOf']
        };

        getClient().then(client => {
            client.search(base_dn, opts, (err, res) => { // replace with your base DN
                if (err) {
                    reject(err);
                }

                res.on('searchEntry', entry => {
                    const user = entry.object;
                    const email = user.mail;
                    const groups = user.memberOf;

                    resolve({username, email, groups});
                });

                res.on('error', reject);
                res.on('end', result => {
                    if (result.status !== 0) {
                        reject(new Error(`LDAP search failed with status ${result.status}`));
                    }
                });
            });
        });
    });
}

module.exports = {
    getEmailAndGroups
}