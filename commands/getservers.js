module.exports = {
	name: 'getservers',
    description: 'This command lets you see every Server i am in!',
    ownerOnly: true,
    cooldown: 0,
    args: 0,
    aliases: ['listguilds'],
    hidden: true,
    guildOnly: false,
    mention: false,
    minparams: 0,
    api: false,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl) {
        for (const guild of cl.guilds.values()) {
            const owncl = await cl.fetchUser(guild.ownerID);
            const owner = `${owncl.tag}`;
            msg.channel.send(`\`\`\`Server Name:   ${guild.name}\nOwner: \t\t${owner}\nMembers:   \t${guild.memberCount}\nServer Region: ${guild.region}\nServer ID: \t${guild.id}\`\`\``);
        }
	},
};