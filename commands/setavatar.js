module.exports = {
	name: 'setavatar',
    description: 'This command sets the avatar of the bot.',
    args: true,
    ownerOnly: true,
    hidden: true,
    usage: '<image>',
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
        console.log(args[0]);
        cl.user.setAvatar(args[0]);
        msg.channel.send('Successfully changed avatar.');
	},
};