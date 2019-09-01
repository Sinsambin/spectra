const fetch = require('node-fetch');
const Discord = require('discord.js');
const { osuapikey, botowner } = require('../config.json');
module.exports = {
	name: 'register',
	description: 'You can register yourself to link your osu! account with your discord account.\nNote that this is a permanent Link and can only get removed under specific Circumstances.',
	ownerOnly: false,
	aliases: ['reg', 'link', 'oregister', 'oreg', 'olink'],
	usage: '<osu! username you want to link>',
	register: true,
	//eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl, Register) {
        if(args.length > 0) {
            if(!((args[0] == 'deletelink' && botowner == msg.author.id && args.length > 2) || (args[0] == 'links' && botowner == msg.author.id))) {
                let allargs;
                for(let q = 0; q < args.length; q++) {
                    if(q == 0) {
                        allargs = args[q];
                    }else{
                        allargs += ' ' + args[q];
                    }
                }
                const query = 'https://osu.ppy.sh/api/get_user?u=' + allargs + '&k=' + osuapikey;
                const body = await fetch(query).then(response => response.json());

                //checks if the account the user wants to link exist to prevent errors
                if(body.length != 1) {
                    const resultEmbed = new Discord.RichEmbed()
                    .setTitle(`${cl.user.username} osu! Account Linking Service`)
                    .setTimestamp()
                    .setDescription('The osu! user you specified does not exist.')
                    .setColor('#ff66aa')
                    .setFooter(msg.author.tag);
                    return msg.channel.send(resultEmbed);
                }
                const checkosu = await Register.findOne({ where: { osuid: body[0].user_id } });
                const checkdiscord = await Register.findOne({ where: { discordid: msg.author.id } });

                //checks if osu! account is already linked
                if(checkosu) {
                    const resultEmbed = new Discord.RichEmbed()
                    .setTitle(`${cl.user.username} osu! Account Linking Service`)
                    .setTimestamp()
                    .setDescription('This osu! user is already linked to <@' + checkosu.get('discordid') + '>.')
                    .setColor('#ff66aa')
                    .setFooter(msg.author.tag);
                    return msg.channel.send(resultEmbed);

                //checks if discord account is already linked
                }else if(checkdiscord) {
                    const query2 = 'https://osu.ppy.sh/api/get_user?u=' + checkdiscord.osuid + '&k=' + osuapikey;
                    const body2 = await fetch(query2).then(response => response.json());
                    const resultEmbed = new Discord.RichEmbed()
                    .setTitle(`${cl.user.username} osu! Account Linking Service`)
                    .setTimestamp()
                    .setDescription('Your Discord account is already linked to the osu! user ' + body2[0].username + '.')
                    .setColor('#ff66aa')
                    .setFooter(msg.author.tag);
                    return msg.channel.send(resultEmbed);

                //if all checks pass, the user will be prompted if he is 100% positive he wants to link the accounts. if yes, accounts are linked here
                }else{
                    const resultEmbed = new Discord.RichEmbed()
                    .setTitle(`${cl.user.username} osu! Account Linking Service`)
                    .setTimestamp()
                    .setDescription('Are you sure you want to link your Discord-Account (' + msg.author.tag + ') to the osu! user ' + body[0].username + '?\nWARNING: This is permanent and can only be removed in specific cases!')
                    .setColor('#ff66aa')
                    .setFooter(msg.author.tag);
                    msg.channel.send(resultEmbed).then(async function(botmsg) {
                        const owncl = await cl.fetchUser(botowner);
                        const owner = `${owncl.tag}`;
                        botmsg.react('✅').then(() => botmsg.react('❌'));

                        const filter = (reaction, user) => {
                            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id;
                        };
                        botmsg.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first();

                            if(reaction.emoji.name === '✅') {
                                try{
                                    Register.create({
                                        osuid: body[0].user_id,
                                        discordid: msg.author.id,
                                    });
                                    const successEmbed = new Discord.RichEmbed()
                                    .setTitle(`${cl.user.username} osu! Account Linking Service`)
                                    .setTimestamp()
                                    .setDescription(`Discord-Account <@${msg.author.id}> was successfully linked to the osu! user ` + body[0].username + '.')
                                    .setColor('#ff66aa')
                                    .setFooter(msg.author.tag);
                                    return msg.channel.send(successEmbed);
                                }catch(e) {
                                    return msg.channel.send(`An error occured while adding the Tag. Please contact **${owner}** and give them the following errorcode: \`SequeliteInsertEntryErrorReg\``);
                                }
                            }else{
                                msg.reply('Account linking cancelled.');
                            }
                        })
                        .catch(() => {
                            msg.reply('you took too long to answer. Please try again.');
                        });
                    }).catch(async function() {
                        const owncl = await cl.fetchUser(botowner);
                        const owner = `${owncl.tag}`;
                        msg.reply(`I\'m sorry, but an error happened while executing the command. Please report this issue to **${owner}**.`);
                    });
                }

            }else if(args[0] == 'links') {
                const linklistdc = await Register.findAll({ attributes: ['discordid'] });
                const linklistosu = await Register.findAll({ attributes: ['osuid'] });

                let alllinks;
                for(let z = 0;z < linklistdc.length; z++) {
                    const myid = linklistdc[z].discordid;
                    const newcl = await cl.fetchUser(myid);
                    if(z == 0) {
                        alllinks = 'All Links:\n' + newcl.username + '#' + newcl.discriminator + ' (' + linklistdc[0].discordid + ') <-> <https://osu.ppy.sh/u/' + linklistosu[0].osuid + '>';
                    }else{
                        alllinks += '\n' + newcl.username + '#' + newcl.discriminator + ' (' + linklistdc[z].discordid + ') <-> <https://osu.ppy.sh/u/' + linklistosu[z].osuid + '>';
                    }
                }
                //const alllinks = linklist.map(l => l.name).join(' - ') || 'There are no links so far.';
                return msg.channel.send(`${alllinks}`);

            //in case of emergency, bot owner can remove links here
            }else{
                let discordid;
                if(msg.mentions.users.size != 1) {
                    discordid = args[1];
                }else{
                    discordid = msg.mentions.users.first().id;
                }
                let osuname;
                for(let q = 2; q < args.length; q++) {
                    if(q == 2) {
                        osuname = args[q];
                    }else{
                        osuname += ' ' + args[q];
                    }
                }
                const query = 'https://osu.ppy.sh/api/get_user?u=' + osuname + '&k=' + osuapikey;
                const body = await fetch(query).then(response => response.json());
                const osuid = body[0].user_id;
                const deleted = await Register.destroy({ where: { osuid: osuid, discordid: discordid } });
                if(!deleted) {
                    const returnEmbed = new Discord.RichEmbed()
                    .setTitle(`${cl.user.username} osu! Account Linking Service`)
                    .setTimestamp()
                    .setDescription(`There is no Link between <@${discordid}> (${discordid}) and ${body[0].username} (${body[0].user_id})!`)
                    .setColor('#ff66aa')
                    .setFooter(msg.author.tag);
                    return msg.channel.send(returnEmbed);
                }
                const returnEmbed = new Discord.RichEmbed()
                .setTitle(`${cl.user.username} osu! Account Linking Service`)
                .setTimestamp()
                .setDescription(`Link between <@${discordid}> (${discordid}) and ${body[0].username} (${body[0].user_id}) was successfully deleted.`)
                .setColor('#ff66aa')
                .setFooter(msg.author.tag);
                return msg.channel.send(returnEmbed);
            }
        } else {
            const checkdiscord = await Register.findOne({ where: { discordid: msg.author.id } });
            if(checkdiscord) {
                const query = 'https://osu.ppy.sh/api/get_user?u=' + checkdiscord.osuid + '&k=' + osuapikey;
                const body = await fetch(query).then(response => response.json());
                const resultEmbed = new Discord.RichEmbed()
                    .setTitle(`${cl.user.username} osu! Account Linking Service`)
                    .setTimestamp()
                    .setDescription(`Your Discord account is linked to the osu! user [${body[0].username}](https://osu.ppy.sh/u/${body[0].user_id}).`)
                    .setColor('#ff66aa')
                    .setFooter(msg.author.tag);
                return msg.channel.send(resultEmbed);
            } else {
                const resultEmbed = new Discord.RichEmbed()
                    .setTitle(`${cl.user.username} osu! Account Linking Service`)
                    .setTimestamp()
                    .setDescription('Your Discord account is not linked yet.')
                    .setColor('#ff66aa')
                    .setFooter(msg.author.tag);
                return msg.channel.send(resultEmbed);
            }
        }
	},
};