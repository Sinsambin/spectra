const { prefix, botowner } = require('../config.json');
module.exports = {
    name: 'help',
    description: 'Displays the list with all commands.',
    aliases: ['commands', 'hilfe', 'sos'],
    usage: '[command name]',
	// eslint-disable-next-line no-unused-vars
    async execute(msg, args, cl) {
        const myreply = [];
        const { commands } = msg.client;

        if(!args.length) {
            myreply.push('My Commands:```');
            for(const c of commands) {
                const cmd = cl.commands.get(c[0]);
                if(!cmd.hidden) {
                    myreply.push(c[0]);
                }
            }
            const owner = await cl.fetchUser(botowner);
            myreply.push('```', `\nIf you need more information about a specific command, type ${prefix}help [command]!\nIf you expierience issues/bugs, please DM **${owner.tag}**.`);

            return msg.author.send(myreply, { split: true }).then(() => {
                if(msg.channel.type === 'dm') {
                    return;
                }
                msg.reply('✅ A list with all commands you can use with me should\'ve been sent straight into your dm\'s!');
            }).catch(error => {
                console.error(`Failed to send the help list to ${msg.author.tag}'s DMs. Problem:`, error);
                msg.reply('🤔 Looks like my power isn\'t big enough to DM you. Could it be possible that you\'ve got your DM\'s turned off?');
            });
        }

        const name = args[0].toLowerCase();
        const cmd = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        if(!cmd) {
            return msg.reply('⛔ There is no command with that name.');
        }

        myreply.push(`**__Additional Help for the *${cmd.name}* command!__**`);

        if(cmd.aliases) {
            myreply.push(`\nAvailable aliases: *${cmd.aliases.join(', ')}*`);
        }

        if(cmd.description) {
            myreply.push(`\n${cmd.description}\n`);
        }

        if(cmd.usage) {
            myreply.push(`Syntax: ${prefix}${cmd.name} ${cmd.usage}`);
        }

        if(cmd.cooldown) {
            myreply.push(`Cooldown of this command: ${cmd.cooldown} second(s).`);
        }

        if(cmd.guildOnly) {
            myreply.push('This commmand can be only used in guilds.');
        }

        if(cmd.ownerOnly) {
            myreply.push('This Command is only usable by the Bot-Owner.');
        }

        msg.channel.send(myreply, { split: true });
    },
};