const {getEmailAndGroups} = require("./ldap_gateway");


async function compareGroups(user1, user2) {
    const userData1 = await getEmailAndGroups(user1);
    const userData2 = await getEmailAndGroups(user2);

    const user1Groups = new Set(userData1.groups);
    const user2Groups = new Set(userData2.groups);

    const user1UniqueGroups = Array.from(user1Groups).filter(group => !user2Groups.has(group));
    const user2UniqueGroups = Array.from(user2Groups).filter(group => !user1Groups.has(group));

    return {
        [user1]: {
            email: userData1.email, uniqueGroups: user1UniqueGroups,
        },
        [user2]: {
            email: userData2.email, uniqueGroups: user2UniqueGroups,
        },
    };
}

module.exports = {
    compareGroups
}