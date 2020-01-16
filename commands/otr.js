const fetch = require('node-fetch');
const { osuapikey, prefix } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'otr',
    description: 'This command shows the most recent pass in osu!taiko mode (in the past 24 hours) about a specific osu! player.\n If you are not registered, you will need to specify a user.',
    cooldown: 10,
    usage: '<Username / user id>',
    register: true,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl, Register) {
        const checkdiscord = await Register.findOne({ where: { discordid: msg.author.id } });
        let searchuser;
        if(checkdiscord && !args.length) {
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
        const query = 'https://osu.ppy.sh/api/get_user_recent?u=' + searchuser + '&k=' + osuapikey + '&limit=50&m=1';
        const query2 = 'https://osu.ppy.sh/api/get_user?u=' + searchuser + '&k=' + osuapikey;
        const tail = await fetch(query2).then(response => response.json());
        const body = await fetch(query).then(response => response.json());
        if(body.length > 0) {
            let foundpass = false;
            let count = 0;
            let head;
            while(count < body.length && !foundpass) {
                if(body[count].rank != 'F') {
                    console.log(count);
                    head = body[count];
                    foundpass = true;
                }else{
                    count++;
                }
            }
            console.log(count);

            if(foundpass) {
                const query3 = 'http://osu.ppy.sh/api/get_beatmaps?b=' + body[count].beatmap_id + '&k=' + osuapikey;
                const foot = await fetch(query3).then(response => response.json());
                const bmname = foot[0].artist + ' - ' + foot[0].title + ' [' + foot[0].version + ']';
                let srating = foot[0].difficultyrating;
                srating = srating.substring(0, 4);
                const dll = 'osu://dl/' + foot[0].beatmapset_id + '/';
                let convrank = head.rank;
                if(convrank == 'XH') {
                    convrank = 'SS+';
                }else if(convrank == 'X') {
                    convrank = 'SS';
                }else if(convrank == 'SH') {
                    convrank = 'S';
                }
                const accCalc = (((0.5 * head.count100) + (1 * head.count300)) / (1 * head.countmiss + 1 * head.count50 + 1 * head.count100 + 1 * head.count300));
                const resultEmbed = new Discord.RichEmbed()
                    .setColor('#ff66aa')
                    .setTitle(tail[0].username + '\'s most recent pass')
                    .setImage('https://assets.ppy.sh/beatmaps/' + foot[0].beatmapset_id + '/covers/cover.jpg')
                    .setDescription('If you are an osu!supporter and would like to download this beatmap, click here: <' + dll + '>')
                    .addField('Beatmap Name', bmname + ', mapped by ' + foot[0].creator, true)
                    .addField('Star Rating', srating + '⭐', true)
                    .addBlankField(false)
                    .addField('Hits', head.count300 + '/' + head.count100 + '/' + head.count50 + '/' + head.countmiss, true)
                    .addField('Score', head.score, true);
                    if(head.perfect == 0) {
                        resultEmbed.addField('Max Combo', head.maxcombo, true);
                    }else{
                        resultEmbed.addField('Max Combo', head.maxcombo + ' (Full Combo)', true);
                    }
                    resultEmbed.addField('Achieved Rank', convrank, true)
                    .addField('Accuracy', `${accCalc.toFixed(2)}%`, true)
                    .setTimestamp()
                    .setFooter(msg.author.tag)
                    .setURL('https://osu.ppy.sh/b/' + body[count].beatmap_id)
                    .setThumbnail('https://a.ppy.sh/' + body[count].user_id);
                msg.channel.send(resultEmbed);
            }else{
                const resultEmbed = new Discord.RichEmbed()
                    .setColor('#ff66aa')
                    .setTitle('osu! User Profile')
                    .setURL('https://osu.ppy.sh/users/' + searchuser)
                    .setDescription('This User didn\'t pass any map recently in osu!taiko mode.')
                    .setTimestamp()
                    .setFooter(msg.author.tag);
                    msg.channel.send(resultEmbed);
            }
        }else{
            const resultEmbed = new Discord.RichEmbed()
                .setColor('#ff66aa')
                .setTitle('osu! User Profile')
                .setURL('https://osu.ppy.sh/users/' + searchuser)
                .setDescription('This User didn\'t pass any map recently in osu!taiko mode.')
                .setTimestamp()
                .setFooter(msg.author.tag);
                msg.channel.send(resultEmbed);
        }
	},
};