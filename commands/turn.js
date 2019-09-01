module.exports = {
	name: 'turn',
  description: 'This Command turns your sentence!',
  args: true,
  usage: '<sentence>',
	// eslint-disable-next-line no-unused-vars
	execute(msg, args, cl) {
        let reversed = '';
        const text = msg.content.substring(5);
        let i = text.length;
        while (i > 0) {
          reversed += text.substring(i - 1, i);
          i--;
        }
        console.log(args);
        msg.channel.send(reversed);
	},
};