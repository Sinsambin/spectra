const { botowner } = require('../config.json');
module.exports = {
	name: 'leaveguild',
	description: 'Forces the bot to leave a server.',
    ownerOnly: true,
    cooldown: 0,
    args: true,
    usage: '<Server ID>',
    hidden: true,
    guildOnly: false,
    mention: false,
    aliases: [],
    minparams: 1,
    api: false,
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
        const guild = cl.guilds.get(args[0]);
        if(!guild == '') {
            msg.channel.send(`Are you sure you want to make the bot leave the guild ${guild.name}?`).then(function(botmsg) {
                botmsg.react('✅').then(() => botmsg.react('❌'));

                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id;
                };

                botmsg.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();

                    if(reaction.emoji.name === '✅') {
                        guild.leave()
                        .then(() => msg.channel.send('Guild successfully left.'));

                    }else{
                        msg.reply('Leaving cancelled.');
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
        } else{
            msg.channel.send('This guild does not exist. Please try again with a valid url.');
        }
	},
};