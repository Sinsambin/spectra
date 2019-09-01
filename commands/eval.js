module.exports = {
	name: 'eval',
    description: 'Evaluates Nashorn Code.',
    ownerOnly: true,
    hidden: true,
    //disabled: true,
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl) {
		try{
            if(args[0] == 'listguilds') {
                args.shift();
                return console.log(cl.guilds);
            }
            const code = args.join(' ');
            let evalthis = await eval(code);

            if(typeof evalthis !== 'string') evalthis = require('util').inspect(evalthis);
            if (typeof (evalthis) === 'string') evalthis = evalthis.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            try{
                await msg.channel.send(`Evaluated Successfully:\n\`\`\`${evalthis.substring(0, 1970)}\`\`\``);
            }catch(e1) {
                try{
                    msg.channel.send(`Evaluated Successfully:\n\`\`\`${evalthis}\`\`\``);
                }catch(e2) {
                    msg.channel.send('Evaluated Successfully:\n```Error in printing the Error. See the Console Log for more Details.```');
                }
            }
        }catch(e) {
            console.log(e);
            try{
                await msg.channel.send(`An Exception was thrown:\n\`\`\`${e.substring(0, 1970)}\`\`\``);
            }catch(e1) {
                try{
                    msg.channel.send(`An Exception was thrown:\n\`\`\`${e}\`\`\``);
                }catch(e2) {
                    msg.channel.send('An Exception was thrown:\n```Error in printing the Error. See the Console Log for more Details.```');
                }
            }
        }
	},
};