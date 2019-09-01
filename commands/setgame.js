module.exports = {
	name: 'setgame',
    description: 'This Command sets the status of the bot (e.g. playing osu!)',
    args: true,
    ownerOnly: true,
    hidden: true,
    usage: '<Playing/Watching/Listening> <new status>',
    aliases: ['setstatus'],
    minparams: 1,
    cooldown: 60,
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
        if(((args[0].toUpperCase() == 'WATCHING') || (args[0].toUpperCase() == 'PLAYING') || (args[0].toUpperCase() == 'LISTENING'))) {
            let response = args[0];
            if(args[0].toUpperCase() == 'LISTENING' && args[1].toLowerCase() == 'to') {
                response += ' ', args[1];
                args.splice(1, 1);
            }else if(args[0].toUpperCase() == 'LISTENING' && !(args[1].toLowerCase() == 'to')) {
                response += ' to';
            }
            const statustype = args[0].toUpperCase();
            let newstatus = '';
            for(let i = 1;i < (args.length);i++) {
                if(i == 1) {
                    newstatus = args[i];
                }else{
                    newstatus += ' ' + args[i];
                }
            }
            cl.user.setActivity(newstatus, { type: statustype });
            msg.channel.send(cl.user.username + ' is now ' + response + ' ' + newstatus + '.');
        }else{
            const statustype = 'PLAYING';
            let newstatus = '';
            for(let q = 0;q < (args.length);q++) {
                if(q == 0) {
                    newstatus = args[q];
                }else{
                    newstatus += ' ' + args[q];
                }
            }
            cl.user.setActivity(newstatus, { type: statustype });
            msg.channel.send(cl.user.username + ' is now playing ' + newstatus + '.');
        }
	},
};