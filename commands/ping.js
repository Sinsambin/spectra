module.exports = {
	name: 'ping',
	description: 'This is a test command so you can check if the bot is online and has read/send messages permissions.',
    ownerOnly: false,
    cooldown: 0,
    args: 0,
    hidden: false,
    guildOnly: false,
    mention: false,
    aliases: [],
    minparams: 0,
    api: false,
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
        msg.channel.send(`🏓 The average Websocket ping is ${Math.round(cl.ping)} ms.`);
	},
};