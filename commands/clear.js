module.exports = {
	name: 'clear',
    description: 'With this command, you can purge a specific amount of messages (up to 100). If you dont specify an amount, it deletes 100 messages by default.\nNote that messages which are older than 2 weeks cannot be deleted.\nTo use this command, Manage Messages permissions are needed.',
    guildOnly: true,
    aliases: ['clean', 'purge'],
    usage: '[amount]',
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl) {
        if(msg.guild.me.permissions.has('MANAGE_MESSAGES')||msg.guild.me.permissions.has('ADMINISTRATOR')) {
            if(msg.member.permissions.has('MANAGE_MESSAGES')||msg.member.permissions.has('ADMINISTRATOR')) {
                if(args.length == 0) {
                    msg.channel.bulkDelete(100, true);
                    msg.channel.send('Successfully cleared the Channel!');
                    const channel = msg.guild.channels.find(c => c.name == 'serverlog');
                    if (!channel) return;
                    channel.send(`🗑 **#${msg.channel.name}** has been cleared by \`${msg.author.tag}(${msg.author.id})\`.`);
                } else if((args[0].match(/^\d+$/) && (args[0] > 1) && (args[0] < 100))) {
                    const toDelete = parseInt(args[0]) + 1;
                    msg.channel.bulkDelete(toDelete, true);
                    msg.channel.send(`Successfully deleted ${toDelete - 1} messages!`);
                    const channel = msg.guild.channels.find(c => c.name == 'serverlog');
                    if (!channel) return;
                    channel.send(`🗑 ${toDelete - 1} messages have been deleted from ${msg.channel.name} by \`${msg.author.tag} (${msg.author.id})\`.`);
                } else{
                    msg.channel.send('❌ Wrong amount of messages to be deleted. The amount must be a number between 2 and 99.');
                }
            }else{
                msg.channel.send('❌ You don\'t have the permissions to delete Messages!');
            }
        }else{
            msg.channel.send('❌ I don\'t have the permissions to delete Messages!');
        }
	},
};