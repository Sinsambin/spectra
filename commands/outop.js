const Discord = require('discord.js');
const fetch = require('node-fetch');
const { osuapikey, prefix, botowner } = require('../config.json');
module.exports = {
	name: 'outop',
    description: 'This command shows the best 10 plays from a osu! player.\n⚠This command may take several seconds to load, please be patient!⚠\n If you are not registered, you will need to specify a user.',
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
        const query = 'https://osu.ppy.sh/api/get_user_best?u=' + searchuser + '&k=' + osuapikey + '&limit=10';
        const query2 = 'https://osu.ppy.sh/api/get_user?u=' + searchuser + '&k=' + osuapikey;
        const head = await fetch(query2).then(response => response.json());
        if(head.length == 1) {
            const resultEmbed = new Discord.RichEmbed()
                .setColor('#ff66aa')
                .setTitle(head[0].username + '\'s top 10 plays')
                .setURL('https://osu.ppy.sh/u/' + head[0].user_id)
                .setThumbnail('https://a.ppy.sh/' + head[0].user_id);
            const body = await fetch(query).then(response => response.json());

                for(let i = 0;i < body.length;i++) {
                    const query3 = 'https://osu.ppy.sh/api/get_beatmaps?b=' + body[i].beatmap_id + '&k=' + osuapikey;
                    const pretail = await fetch(query3).then(response=> response.json());
                    const tail = pretail[0];
                    let rank = body[i].rank;
                    if(rank == 'XH') {
                        rank = 'SS+';
                    }else if(rank == 'X') {
                        rank = 'SS';
                    }else if(rank == 'SH') {
                        rank = 'S';
                    }
                    resultEmbed.addField('Rank ' + (i + 1), '[' + tail.artist + ' - ' + tail.title + ' [' + tail.version + ']](https://osu.ppy.sh/b/' + body[i].beatmap_id + '), ' + Math.round(body[i].pp) + ' PP, ' + rank + ' Rank');
                }

                resultEmbed.setFooter(msg.author.tag)
                .setTimestamp();
            await msg.channel.send(resultEmbed);

            msg.channel.send('Would you like to see beatmap Statistics from the top 10?\n*Please wait for all reactions to pop up before selecting!*').then(function(botmsg) {
                if(msg.channel.type !== 'text') { msg.delete();}
                botmsg.react('1⃣').then(() => botmsg.react('2⃣')).then(() => botmsg.react('3⃣')).then(() => botmsg.react('4⃣')).then(() => botmsg.react('5⃣')).then(() => botmsg.react('6⃣'))
                .then(() => botmsg.react('7⃣')).then(() => botmsg.react('8⃣')).then(() => botmsg.react('9⃣')).then(() => botmsg.react('🔟')).then(() => botmsg.react('❌'));

                const filter = (reaction, user) => {
                    return ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id;
                };

                botmsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    if(!(reaction.emoji.name === '❌')) {
                        const redirect = cl.commands.get('obinfo');
                        let bmcall;
                        if(reaction.emoji.name === '1⃣') {
                                bmcall = body[0].beatmap_id;
                        }else if(reaction.emoji.name === '2⃣') {
                                bmcall = body[1].beatmap_id;
                        }else if(reaction.emoji.name === '3⃣') {
                                bmcall = body[2].beatmap_id;
                        }else if(reaction.emoji.name === '4⃣') {
                                bmcall = body[3].beatmap_id;
                        }else if(reaction.emoji.name === '5⃣') {
                                bmcall = body[4].beatmap_id;
                        }else if(reaction.emoji.name === '6⃣') {
                                bmcall = body[5].beatmap_id;
                        }else if(reaction.emoji.name === '7⃣') {
                                bmcall = body[6].beatmap_id;
                        }else if(reaction.emoji.name === '8⃣') {
                                bmcall = body[7].beatmap_id;
                        }else if(reaction.emoji.name === '9⃣') {
                                bmcall = body[8].beatmap_id;
                        }else if(reaction.emoji.name === '🔟') {
                                bmcall = body[9].beatmap_id;
                        }
                        botmsg.delete().then(() => redirect.execute(msg, [ 'b', bmcall], cl, osuapikey));

                    } else{
                        botmsg.delete();
                    }
                })
                .catch(() => {
                    console.log('Err603: Timeout --> Not Showing Diffs.');
                    botmsg.delete();
                });
            }).catch(async function() {
                const owncl = await cl.fetchUser(botowner);
                const owner = `${owncl.tag}`;
                msg.reply(`I\'m sorry, but an error happened while executing the command. Please report this issue to **${owner}**.`);
            });
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