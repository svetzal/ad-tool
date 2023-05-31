const ldap = require('ldapjs');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const {Parser} = require('json2csv');
const fs = require('fs');
const keytar = require('keytar');

async function main() {
    const service = 'ActiveDirectoryService';
    const account = 'ActiveDirectoryAccount'; // replace with the account for which you have stored the password
    const password = await keytar.getPassword(service, account);

    const client = ldap.createClient({
        url: 'ldap://example.com' // Put your Active Directory URL here
    });

    client.bind(account, password, err => {
        if (err) {
            console.error('Error binding to LDAP:', err);
        }
    });

    async function getEmailAndGroups(username) {
        return new Promise((resolve, reject) => {
            const opts = {
                filter: `(sAMAccountName=${username})`,
                scope: 'sub',
                attributes: ['mail', 'memberOf']
            };

            client.search('dc=example,dc=com', opts, (err, res) => { // replace with your base DN
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
    }

    async function compareGroups(user1, user2) {
        const userData1 = await getEmailAndGroups(user1);
        const userData2 = await getEmailAndGroups(user2);

        const user1Groups = new Set(userData1.groups);
        const user2Groups = new Set(userData2.groups);

        const user1UniqueGroups = Array.from(user1Groups).filter(group => !user2Groups.has(group));
        const user2UniqueGroups = Array.from(user2Groups).filter(group => !user1Groups.has(group));

        return {
            [user1]: {
                email: userData1.email,
                uniqueGroups: user1UniqueGroups,
            },
            [user2]: {
                email: userData2.email,
                uniqueGroups: user2UniqueGroups,
            },
        };
    }

    const argv = yargs(hideBin(process.argv))
        .option('user1', {
            description: 'First username to query',
            type: 'string',
            demandOption: true,
        })
        .option('user2', {
            description: 'Second username to query',
            type: 'string',
            demandOption: true,
        })
        .option('o', {
            alias: 'output',
            description: 'Output file name (outputs as CSV)',
            type: 'string',
        })
        .help()
        .alias('help', 'h')
        .argv;

    const result = await compareGroups(argv.user1, argv.user2);

    if (argv.o) {
        const fields = ['username', 'email', 'uniqueGroups'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(result);
        fs.writeFileSync(argv.o, csv);
        console.log(`Output written to ${argv.o}`);
    } else {
        console.log(result);
    }
}

main().catch(console.error);
