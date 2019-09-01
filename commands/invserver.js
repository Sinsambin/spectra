module.exports = {
	name: 'invserver',
    description: 'Sends you an invite to a specific server.',
    ownerOnly: false,
    cooldown: 0,
    args: true,
    hidden: true,
    guildOnly: false,
    mention: false,
    aliases: false,
    minparams: 1,
    api: false,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl) {
        if(args.length > 0) {
            for (const guild of cl.guilds.values()) {
                if(guild.id == args[0]) {
                    let i = 0;
                    let invite;
                    for(const channel of guild.channels) {
                        const options = { maxUses : 1, maxAge: 120, unique: true };
                        if(i == 0) invite = await channel[1].createInvite(options, 'tree');
                        i++;
                    }
                    return msg.author.send(`${invite}\nThis invite lasts 2 Minutes.`);
                }
            }
            msg.channel.send('Looks like there is no Server with this ID or i\'m not in that server. Please try again with another query.');
        }
	},
};