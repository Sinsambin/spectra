const { public, botowner, prefix, clientid } = require('../config.json');
const { version } = require('../package.json');
const Discord = require('discord.js');
module.exports = {
	name: 'about',
    description: 'This is a test command so you can check if the bot is online and has read/send messages permissions.',
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
        const owncl = await cl.fetchUser(botowner);
        const owner = `${owncl.tag}`;
        const aboutEmbed = new Discord.RichEmbed();
        let status = cl.status;
        if(status == 0) {
            status = 'Ready';
        } else if(status == 1) {
            status = 'Connecting';
        } else if(status == 2) {
            status = 'Reconnecting';
        } else if(status == 3) {
            status = 'Idle';
        } else if(status == 4) {
            status = 'Nearly';
        } else {
            status = 'Disconnected';
        }
        let msleft = await cl.uptime;
        let dleft = 0;
        let hleft = 0;
        let mleft = 0;
        let sleft = 0;
        while(msleft >= 86400000) {
            msleft -= 86400000;
            dleft++;
        }
        while(msleft >= 3600000) {
            msleft -= 3600000;
            hleft++;
        }
        while(msleft >= 60000) {
            msleft -= 60000;
            mleft++;
        }
        while(msleft >= 1000) {
            msleft -= 1000;
            sleft++;
        }
        const time = `${dleft} days, ${hleft} hours, ${mleft} minutes and ${sleft} seconds.`;


        if(public) {
            aboutEmbed.setTitle(`All about ${cl.user.tag}!`)
            .setTimestamp()
            .setFooter(msg.author.tag)
            .setColor('RANDOM')
            .setDescription(`Hello! My name is ${cl.user.username}, a utility bot that connects osu!, shows you the weather, some cute cat pictures and more!\nI was programmed by *${owner}* in [Discord.js](https://discord.js.org), a Framework for NodeJS/Javascript!`
             + ` I am running on Version ${version}.\nType ${prefix}help to see my commands!\nI would appreciate it if you could [invite](https://discordapp.com/oauth2/authorize?client_id=${clientid}&scope=bot&permissions=70773955) me to your Server!`
             + '\nFor example, i am here to:```\n✅Serve your osu! stats!\n✅Show you the weather\n✅Make your administration life easier```')
             .addField('Servers', cl.guilds.size, true)
             .addField('Uptime', time, true)
             .addField('Status', status, true);
        } else {
            aboutEmbed.setTitle(`All about ${cl.user.tag}!`)
            .setTimestamp()
            .setColor('RANDOM')
            .setFooter(msg.author.tag)
            .setDescription(`Hello! My name is ${cl.user.username}, a utility bot that connects osu!, shows you the weather, some cute cat pictures and more!\nI was programmed by *${owner}* in [Discord.js](https://discord.js.org), a Framework for NodeJS/Javascript!`
             + ` I am running on Version ${version}.\nType ${prefix}help to see my commands!`
             + '\n\nFor example, i am here to:```\n✅Serve your osu! stats!\n✅Show you the weather\n✅Make your administration life easier```')
             .addField('Servers', cl.guilds.size)
             .addField('Uptime', time)
             .addField('Status', status, true);
        }
        msg.channel.send(aboutEmbed);
	},
};