const fetch = require('node-fetch');
const Discord = require('discord.js');
const { osuapikey, prefix } = require('../config.json');
module.exports = {
	name: 'ouinfo',
    description: 'This command shows some information about a specific osu! player.',
    cooldown: 10,
    usage: '<Username / user id>',
    register: true,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl, Register) {
        const checkdiscord = await Register.findOne({ where: { discordid: msg.author.id } });
        let searchuser;
        if(checkdiscord &&!args.length) {
            searchuser = checkdiscord.osuid;
        }else if(!args.length) {
            return msg.channel.send(`You provided too few arguments ${msg.author}!\nSyntax: ${prefix}${this.name} ${this.usage}`);
        }else {
            searchuser = '';
            for(let i = 0;i < (args.length);i++) {
                if(i == 0) {
                    searchuser = args[i];
                }else{
                    searchuser += ' ' + args[i];
                }
            }
        }
        const query = 'https://osu.ppy.sh/api/get_user?u=' + searchuser + '&k=' + osuapikey;
        const body = await fetch(query).then(response => response.json());
        if(body.length == 1) {
            const joindate = body[0].join_date;
            const resultEmbed = new Discord.RichEmbed()
                .setColor('#ff66aa')
                .setTitle('osu! User Profile')
                .setURL('https://osu.ppy.sh/u/' + body[0].user_id)
                .setThumbnail('https://a.ppy.sh/' + body[0].user_id)
                .addField('Username', body[0].username, true)
                .addField('PP', Math.round(body[0].pp_raw), true)
                .addField('Global Rank', body[0].pp_rank, true)
                .addField('Country Rank', body[0].pp_country_rank, true)
                .addField('Playcount', body[0].playcount, true)
                .addField('Join Date', joindate.substring(8, 10) + '.' + joindate.substring(5, 7) + '.' + joindate.substring(0, 4), true)
                .setTimestamp()
                .setFooter(msg.author.tag);
            msg.channel.send(resultEmbed);
        }else{
            const resultEmbed = new Discord.RichEmbed()
                .setColor('#ff66aa')
                .setTitle('osu! User Profile')
                .setURL('https://osu.ppy.sh/users/' + searchuser)
                .setDescription('This User doesn\'t exist. Please try again with another query.')
                .setTimestamp()
                .setFooter(msg.author.tag);
                msg.channel.send(resultEmbed);
        }
	},
};