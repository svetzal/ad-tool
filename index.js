const ldap = require('ldapjs');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const {Parser} = require('json2csv');
const fs = require('fs');
const keytar = require('keytar');

const { compareGroups } = require('./core');

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
