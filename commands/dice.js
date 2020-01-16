const Discord = require('discord.js');
module.exports = {
    name: 'dice',
    description: 'This command lets you roll a dice',
    usage: '[sides]',
    // eslint-disable-next-line no-unused-vars
    execute(msg, args, cl) {
        let sides;
        if(args.length) {
            sides = args[0];
        } else {
            sides = 6;
        }

        const result = Math.floor(Math.random() * sides) + 1;
        const embed = new Discord.RichEmbed()
            .setColor('#812aff')
            .setDescription(`🎲 You rolled a ${result}!`)
            .setTimestamp()
            .setFooter(msg.author.tag);
        msg.channel.send(embed);
    },
};