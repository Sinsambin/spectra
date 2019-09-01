const { public, botowner } = require('../config.json');
module.exports = {
	name: 'invite',
    description: 'This command sends you a link, you can invite the bot to your server with!',
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
	async execute(msg, args, cl) {
        if(public) {
            const invite = await cl.generateInvite(87420119);
            msg.channel.send(`I would really appreciate if you could invite me to your server! ^^\n<${invite}>`);
        }else {
            const owner = await cl.fetchUser(botowner);
            msg.channel.send(`Sorry, this bot is private. You cannot invite me to your server.😭 For more information, please contact \`${owner.tag}\`.`);
        }
	},
};