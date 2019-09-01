module.exports = {
	name: 'setname',
    description: 'This Command changes the name of the bot.',
    args: true,
    hidden: true,
    ownerOnly: true,
    usage: '<new name>',
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
        let args2 = '';
        for(let i = 0;i < (args.length);i++) {
            args2 += ' ' + args[i];
        }
        cl.user.setUsername(args2);
        msg.channel.send('Successfully changed name to ' + args2 + '.');
	},
};