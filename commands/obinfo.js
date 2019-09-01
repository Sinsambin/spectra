const fetch = require('node-fetch');
const Discord = require('discord.js');
const { osuapikey, botowner } = require('../config.json');
module.exports = {
	name: 'obinfo',
    description: 'This command shows some information about a specific osu! beatmap.\nIf you dont specify a parameter, the query is taken as a beatmapset-id.',
    cooldown: 10,
    usage: '[b/s] <beatmap(-set) id> [mode] *Note: in order to use mode search, you have to specify b/s (Beatmap/Beatmapset)*',
    args: true,
    minparams: 1,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl) {
        let bmsid;
        let searchtype;
        let mode = 'null';
        if(args.length < 2) {
            searchtype = 's';
            bmsid = args[0];
        }else{
            if(args[0] === 'b' || args[0] === 's') {
                searchtype = args[0];
                bmsid = args[1];
            }else if(args[2] < 4 && args[2] > -1) {
                mode = args[1];
            }
            if(args.length > 2) {
                mode = args[2];
            }
        }

        let query;
        if(searchtype === 'b') {
            query = 'https://osu.ppy.sh/api/get_beatmaps?b=' + bmsid + '&k=' + osuapikey;
        }else{
            query = 'https://osu.ppy.sh/api/get_beatmaps?s=' + bmsid + '&k=' + osuapikey;
        }

        if(mode != 'null') {
            if(mode.toLowerCase() === 'osu' || mode.toLowerCase() === 'standard' || mode.toLowerCase() === 'o' || mode.toLowerCase() == 's') {
                query += '&m=' + 0;
            }else if(mode.toLowerCase() === 'taiko' || mode.toLowerCase() === 't') {
                query += '&m=' + 1;
            }else if(mode.toLowerCase() === 'ctb' || mode.toLowerCase() === 'catch' || mode.toLowerCase() === 'catchthebeat' || mode.toLowerCase() === 'c') {
                query += '&m=' + 2;
            }else if(mode.toLowerCase() === 'mania' || mode.toLowerCase() === 'm') {
                query += '&m=' + 3;
            }else{
                return msg.channel.send('This Mode does not exist!\nValid Modes:\n```Standard: \'osu\' \'standard\' \'o\' \'s\' \nTaiko: \'taiko\' \'t\'\nCatch the Beat: \'ctb\' \'catch\' \'catchthebeat\' \'c\'\nMania: \'mania\' \'m\'```');
            }
        }

        const body = await fetch(query).then(response => response.json());
        if(body.length > 0) {
            if(searchtype == 's' && body.length > 1) {
                const rankedsince = body[0].approved_date;
                const bmname = body[0].artist + ' - ' + body[0].title;
                const rstatus = body[0].approved;
                const resultEmbed = new Discord.RichEmbed()
                    .setColor('#ff66aa')
                    .setTitle('osu! Beatmap Page')
                    .setImage('https://assets.ppy.sh/beatmaps/' + body[0].beatmapset_id + '/covers/cover.jpg')
                    .addField('Beatmap Name', bmname, true)
                    .addField('Mapper', body[0].creator, true)
                    .addBlankField(false)
                    .addField('User Rating', body[0].rating, true)
                    .addField('BPM', Math.round(body[0].bpm), true);
                    if(rstatus == 1) {
                        resultEmbed.addField('Ranked since', rankedsince.substring(8, 10) + '.' + rankedsince.substring(5, 7) + '.' + rankedsince.substring(0, 4), true);
                    }
                    const dll = 'osu://dl/' + body[0].beatmapset_id + '/';
                    resultEmbed.setTimestamp()
                    .setDescription('If you are an osu!supporter and would like to download this beatmap, click here: <' + dll + '>')
                    .setFooter(msg.author.tag);
                    if(searchtype === 'b') {
                        resultEmbed.setURL('https://osu.ppy.sh/b/' + body[0].beatmap_id);
                    }else{
                        resultEmbed.setURL('https://osu.ppy.sh/s/' + body[0].beatmapset_id);
                    }
                    if(rstatus == 4) {
                        resultEmbed.attachFiles(['./assets/loved.png']).setThumbnail('attachment://loved.png');
                    }else if(rstatus == 3 || rstatus == 1) {
                        resultEmbed.attachFiles(['./assets/ranked.png']).setThumbnail('attachment://ranked.png');
                    }else if(rstatus == 2) {
                        resultEmbed.attachFiles(['./assets/approved.png']).setThumbnail('attachment://approved.png');
                    }else if(rstatus < 1) {
                        resultEmbed.attachFiles(['./assets/graveyard.png']).setThumbnail('attachment://graveyard.png');
                    }
                 await msg.channel.send(resultEmbed);

                msg.channel.send('Would you like to see the available difficulties for this map?').then(function(botmsg) {
                    botmsg.react('✅');
                    const filter = (reaction, user) => {
                        return ['✅'].includes(reaction.emoji.name) && user.id === msg.author.id;
                    };

                    botmsg.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();

                        if(reaction.emoji.name === '✅') {
                            botmsg.reactions.get('✅').remove();
                            botmsg.delete();
                            const diffEmbed = new Discord.RichEmbed()
                            .setColor('#ff66aa')
                            .setTitle('Difficulties for ' + bmname + ' mapped by ' + body[0].creator);
                            for(let i = 0;i < body.length;i++) {
                                let srating = body[i].difficultyrating;
                                let mode2 = body[i].mode;
                                if(mode2 == 0) {
                                    mode2 = 'standard';
                                }else if(mode2 == 1) {
                                    mode2 = 'taiko';
                                }else if(mode2 == 2) {
                                    mode2 = 'catch the beat';
                                }else if(mode2 == 3) {
                                    mode2 = 'mania';
                                }
                                srating = srating.substring(0, 4);
                                diffEmbed.addField(body[i].version + ' (' + srating + '⭐) (' + mode2 + ')', 'https://osu.ppy.sh/b/' + body[i].beatmap_id, true);
                            }
                            msg.channel.send(diffEmbed);

                        }else{
                            console.log('Not Showing Diffs.');
                        }
                    })
                    .catch(() => {
                        console.log('Err603: Timeout --> Not Showing Diffs.');
                        botmsg.reactions.get('✅').remove();
                        botmsg.delete();
                    });
                }).catch(function() {
                    const owner = cl.fetchUser(botowner);
                    msg.reply(`I\'m sorry, but an error happened while executing the command. Please report this issue to **${owner.tag}**.`);
                });
            }else{
                const rankedsince = body[0].approved_date;
                const bmname = body[0].artist + ' - ' + body[0].title + ' [' + body[0].version + ']';
                const rstatus = body[0].approved;
                let srating = body[0].difficultyrating; srating = srating.substring(0, 4);
                let blengthsec = body[0].total_length;
                let blengthmin = 0;
                while(blengthsec >= 60) {
                    blengthsec -= 60;
                    blengthmin += 1;
                }
                let blength;
                blength = blengthmin;
                blength += ':';
                if(blengthsec < 10)blength += '0';
                blength += blengthsec;

                const resultEmbed = new Discord.RichEmbed()
                    .setColor('#ff66aa')
                    .setTitle('osu! Beatmap Page')
                    .setImage('https://assets.ppy.sh/beatmaps/' + body[0].beatmapset_id + '/covers/cover.jpg')
                    .addField('Beatmap Name', bmname, true)
                    .addField('Mapper', body[0].creator, true)
                    .addBlankField(false)
                    .addField('User Rating', body[0].rating, true)
                    .addField('BPM', body[0].bpm, true)
                    .addField('Star Rating', srating + '⭐', true)
                    .addField('Song Length', blength, true)
                    .addField('Beatmap ID', body[0].beatmap_id, true);

                    if(rstatus == 1) {
                        resultEmbed.addField('Ranked since', rankedsince.substring(8, 10) + '.' + rankedsince.substring(5, 7) + '.' + rankedsince.substring(0, 4), true);
                    }
                    resultEmbed.setTimestamp()
                    .setFooter(msg.author.tag);
                    resultEmbed.setURL('https://osu.ppy.sh/b/' + body[0].beatmap_id);
                    if(rstatus == 4) {
                        resultEmbed.attachFiles(['./assets/loved.png']).setThumbnail('attachment://loved.png');
                    }else if(rstatus == 3 || rstatus == 1) {
                        resultEmbed.attachFiles(['./assets/ranked.png']).setThumbnail('attachment://ranked.png');
                    }else if(rstatus == 2) {
                        resultEmbed.attachFiles(['./assets/approved.png']).setThumbnail('attachment://approved.png');
                    }else if(rstatus < 1) {
                        resultEmbed.attachFiles(['./assets/graveyard.png']).setThumbnail('attachment://graveyard.png');
                    }
                msg.channel.send(resultEmbed);

            }
        }else{
            const resultEmbed = new Discord.RichEmbed()
                .setColor('#ff66aa')
                .setTitle('osu! Beatmap Page')
                .setURL('https://osu.ppy.sh/' + searchtype + '/' + bmsid)
                .setDescription('This beatmap doesn\'t exist. Please try again with another query.')
                .setTimestamp()
                .setFooter(msg.author.tag);
                msg.channel.send(resultEmbed);
        }
	},
};