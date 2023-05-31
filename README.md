# Active Directory User Group Comparison

This is a Node.js script that compares the Active Directory group memberships between two users. It outputs the groups that are unique to each user.

## Prerequisites

- Node.js and npm
- `ldapjs` npm package
- `yargs` npm package
- `json2csv` npm package
- `keytar` npm package

You can install the necessary dependencies with:

```shell
npm install ldapjs yargs json2csv keytar
```

## Usage

You can run the script with the following command:

```shell
node script.js --user1 USER1 --user2 USER2 [--output OUTPUTFILE]
```

Replace `USER1` and `USER2` with the usernames you want to compare. If you want to output the results to a CSV file, specify the `--output` or `-o` flag followed by the name of the file. If you don't provide an output file, the script will log the results to the console in JSON format.

## Credentials

The script retrieves the Active Directory credentials from the macOS Keychain using the `keytar` package. The service and account used to store the password are specified in the script. You need to replace these with the correct values for your system and ensure that the password has been added to the Keychain.

## Example

```shell
node script.js --user1 john.doe --user2 jane.doe --output results.csv
```

This will compare the group memberships of "john.doe" and "jane.doe", output the unique groups for each user in CSV format, and write the output to `results.csv`.
