module.exports = {
	name: 'userinfo',
  description: 'Responds with some useful information about the user!',
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
    if(args.length == 0) {
      msg.channel.send('```User Name:\t\t\t\t' + msg.author.tag + '\nUser ID:  \t\t\t\t' + msg.author.id +
      '\nAccount Creation Date:\t' + msg.author.createdAt + '```');
    }else if(msg.mentions.users.size > 0) {
        const mentionedmember = msg.mentions.users.first();
        msg.channel.send('```User Name:\t\t\t\t' + mentionedmember.tag + '\nUser ID:  \t\t\t\t' + mentionedmember.id +
        '\nAccount Creation Date:\t' + mentionedmember.createdAt + '```');
    }else{
      const reply = `You have to mention a User or don\'t provide any parameters in order to execute this command ${msg.author}!`;
      msg.channel.send(reply);
    }
	},
};