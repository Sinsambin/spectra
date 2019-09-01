const Discord = require('discord.js');
const fetch = require('node-fetch');
const { osuapikey, botowner } = require('../config.json');
module.exports = {
	name: 'obtop',
    description: 'This command shows the best 10 plays from a osu! beatmap.\n⚠This command may take several seconds to load, please be patient!⚠',
    cooldown: 10,
    usage: '<Username / user id>',
    register: true,
    args: true,
    minparams: 1,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl, Register) {
        const searchmap = args[0];
        const query = 'https://osu.ppy.sh/api/get_scores?b=' + searchmap + '&k=' + osuapikey + '&limit=10';
        const query2 = 'https://osu.ppy.sh/api/get_beatmaps?b=' + searchmap + '&k=' + osuapikey;
        const head = await fetch(query2).then(response => response.json());
        if(head.length == 1) {
            const bmname = head[0].artist + ' - ' + head[0].title + ' [' + head[0].version + ']';
            const resultEmbed = new Discord.RichEmbed()
                .setColor('#ff66aa')
                .setTitle(bmname + '\'s top 10 scores')
                .setURL('https://osu.ppy.sh/b/' + searchmap);
            const body = await fetch(query).then(response => response.json());

                for(let i = 0;i < body.length;i++) {
                    let rank = body[i].rank;
                    if(rank == 'XH') {
                        rank = 'SS+';
                    }else if(rank == 'X') {
                        rank = 'SS';
                    }else if(rank == 'SH') {
                        rank = 'S';
                    }
                    resultEmbed.addField(`Rank ${i + 1}`, ` [${body[i].username}](https://osu.ppy.sh/u/${body[i].user_id}), ${body[i].score} Score, ${body[i].maxcombo} Max Combo, ${Math.round(body[i].pp)} PP, ${rank} Rank`);
                }

                resultEmbed.setFooter(msg.author.tag)
                .setTimestamp();
            await msg.channel.send(resultEmbed);

            msg.channel.send('Would you like to see user Statistics from the top 10?\n*Please wait for all reactions to pop up before selecting!*').then(function(botmsg) {
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
                        const redirect = cl.commands.get('ouinfo');
                        let ucall;
                        if(reaction.emoji.name === '1⃣') {
                                ucall = body[0].user_id;
                        }else if(reaction.emoji.name === '2⃣') {
                                ucall = body[1].user_id;
                        }else if(reaction.emoji.name === '3⃣') {
                                ucall = body[2].user_id;
                        }else if(reaction.emoji.name === '4⃣') {
                                ucall = body[3].user_id;
                        }else if(reaction.emoji.name === '5⃣') {
                                ucall = body[4].user_id;
                        }else if(reaction.emoji.name === '6⃣') {
                                ucall = body[5].user_id;
                        }else if(reaction.emoji.name === '7⃣') {
                                ucall = body[6].user_id;
                        }else if(reaction.emoji.name === '8⃣') {
                                ucall = body[7].user_id;
                        }else if(reaction.emoji.name === '9⃣') {
                                ucall = body[8].user_id;
                        }else if(reaction.emoji.name === '🔟') {
                                ucall = body[9].user_id;
                        }
                        botmsg.delete().then(() => redirect.execute(msg, [ucall], cl, Register));

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

            msg.channel.send('Would you like to download one of the replays?\n*Please wait for all reactions to pop up before selecting!*').then(function(botmsg) {
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
                        const redirect = cl.commands.get('ouinfo');
                        let ucall;
                        if(reaction.emoji.name === '1⃣') {
                                ucall = body[0].user_id;
                        }else if(reaction.emoji.name === '2⃣') {
                                ucall = body[1].user_id;
                        }else if(reaction.emoji.name === '3⃣') {
                                ucall = body[2].user_id;
                        }else if(reaction.emoji.name === '4⃣') {
                                ucall = body[3].user_id;
                        }else if(reaction.emoji.name === '5⃣') {
                                ucall = body[4].user_id;
                        }else if(reaction.emoji.name === '6⃣') {
                                ucall = body[5].user_id;
                        }else if(reaction.emoji.name === '7⃣') {
                                ucall = body[6].user_id;
                        }else if(reaction.emoji.name === '8⃣') {
                                ucall = body[7].user_id;
                        }else if(reaction.emoji.name === '9⃣') {
                                ucall = body[8].user_id;
                        }else if(reaction.emoji.name === '🔟') {
                                ucall = body[9].user_id;
                        }
                        botmsg.delete().then(() => redirect.execute(msg, [ucall], cl, Register));

                    } else{
                        botmsg.delete();
                    }
                })
                .catch(() => {
                    console.log('Err603: Timeout --> Not downloading replay data.');
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
                .setURL('https://osu.ppy.sh/b/' + searchmap)
                .setDescription('This User doesn\'t exist. Please try again with another query.')
                .setTimestamp()
                .setFooter(msg.author.tag);
                msg.channel.send(resultEmbed);
        }
	},
};