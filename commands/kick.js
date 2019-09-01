module.exports = {
	name: 'kick',
    description: 'With this Command, you can kick a member.',
    guildOnly: true,
    hidden: true,
    args: true,
    usage: '<@user> [reason]',
    mention: true,
    ownerOnly: true,
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
        try{
            if(msg.member.permissions.has('KICK_MEMBERS')) {
                let allargs;
                if(args.length > 1) {
                    for(let q = 1; q < args.length; q++) {
                        if(q == 1) {
                            allargs = args[q];
                        }else{
                            allargs += ' ' + args[q];
                        }
                    }
                }
                const kickedmember = msg.mentions.users.first();
                const member = msg.guild.member(kickedmember);
                const channel = msg.guild.channels.find(c => c.name == 'serverlog');
                if (!channel) return;
                if(args.length == 1) allargs = 'No Reason Specified';
                member.kick(`${allargs}\nKick by ${msg.author.tag}`);
                msg.channel.send(`✅Successfully kicked ${member.user.tag}!`);
                channel.send(`👢 ${member.user.tag} was kicked for \`${allargs}\` by ${msg.author.tag}.`);
            } else {
                msg.channel.send('You do not have permissions to kick someone!');
            }
        }catch(DiscordAPIError) {
            msg.channel.send('❌ I don\'t have the permissions to kick someone!');
            console.log(DiscordAPIError);
        }
	},
};