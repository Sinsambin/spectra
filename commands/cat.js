const fetch = require('node-fetch');
module.exports = {
	name: 'cat',
    description: 'This Command will make the bot show you some cute cat pictures! 😺',
    cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl) {
        const body = await fetch('https://aws.random.cat/meow').then(response => response.json());
        msg.channel.send(body.file);
	},
};