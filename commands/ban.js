module.exports = {
	name: 'ban',
    description: 'With this Command, you can ban a member.',
    guildOnly: true,
    hidden: true,
    args: true,
    usage: '<@user> [Length (0 = Perma)] [reason]',
    mention: true,
    ownerOnly: true,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl) {
        try{
            if(msg.member.permissions.has('BAN_MEMBERS')) {
                let allargs;
                let banduration = 0;
                if(args.length > 2 && args[1].match('/\d/g')) {
                    banduration = args[1];
                    for(let q = 2; q < args.length; q++) {
                        if(q == 2) {
                            allargs = args[q];
                        }else{
                            allargs += ' ' + args[q];
                        }
                    }
                } else if(args.length == 2 && args[1].match('/\d/g')) {
                    banduration = args[1];
                } else if(args.length > 1) {
                    for(let q = 1; q < args.length; q++) {
                        if(q == 1) {
                            allargs = args[q];
                        }else{
                            allargs += ' ' + args[q];
                        }
                    }
                }
                const bannedmember = msg.mentions.users.first();
                const member = msg.guild.member(bannedmember);
                const channel = msg.guild.channels.find(c => c.name == 'serverlog');
                if (!channel) return;
                if(args.length == 1 || (args.length == 2 && args[1].match('/\d/g'))) allargs = 'No Reason Specified';
                let options;
                if(banduration != 0 && banduration.match('/\d/g')) {
                    options = await {
                        days: banduration,
                        reason: `${allargs}\tBanned by ${msg.author.tag}`,
                    };
                } else {
                    options = await {
                        reason: `${allargs}\tBanned by ${msg.author.tag}`,
                    };
                }
                console.log(options);
                member.ban(options);
                msg.channel.send(`✅Successfully banned ${member.user.tag}!`)
                .catch(() => msg.channel.send('This User has a higher role than me, i cannot ban them.'));
                channel.send(`🔨 ${member.user.tag} was banned for \`${allargs}\` by ${msg.author.tag}.`);
            } else {
                msg.channel.send('❌ You do not have permissions to ban someone!');
            }
        }catch(DiscordAPIError) {
            msg.channel.send('❌ I don\'t have the permissions to ban someone!');
            console.log(DiscordAPIError);
        }
	},
};