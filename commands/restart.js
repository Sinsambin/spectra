const { botowner } = require('../config.json');
module.exports = {
	name: 'restart',
    description: 'If Node-Mode is active this command will shutdown the bot. If PM2-Mode is active, it will only restart the bot.',
    args: false,
    ownerOnly: true,
    usage: '',
    aliases: ['shutdown'],
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
        const channel = cl.channels.get('442432350446551051');
        if(channel.guild.me.permissions.has('ADMINISTRATOR')) channel.send(`${cl.user.tag} is <@&595252978672205824>`);
        msg.channel.send('Are you sure you want to restart/shutdown the bot?').then(function(botmsg) {
            botmsg.react('✅').then(() => botmsg.react('❌'));

            const filter = (reaction, user) => {
                return ['✅', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id;
            };

            botmsg.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if(reaction.emoji.name === '✅') {
                    msg.channel.send('⚠ Restarting...')
                    .then(() => cl.user.setActivity('Restarting...', { type: 'PLAYING' }))
                    .then(() => cl.user.setStatus('dnd'))
                    .then(() => process.exit());

                }else{
                    msg.reply('Restart cancelled.');
                }
            })
            .catch(() => {
                msg.reply('You took too long to answer. Please try again.');
            });
        }).catch(async function() {
            const owncl = await cl.fetchUser(botowner);
            const owner = `${owncl.tag}`;
            msg.reply(`I\'m sorry, but an error happened while executing the command. Please report this issue to **${owner}**.`);
        });
	},
};