module.exports = {
	name: 'serverinfo',
	description: 'This commands sends some info about this server/guild.',
	guildOnly: true,
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
        msg.channel.send('```Server Name:  \t\t' + msg.guild.name + '\nMember Count: \t\t' + msg.guild.memberCount +
        '\nGuild Create Date:\t' + msg.guild.createdAt + '```');
	},
};