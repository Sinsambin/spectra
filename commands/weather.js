const Discord = require('discord.js');
const { owmapikey } = require('../config.json');
const fetch = require('node-fetch');
module.exports = {
	name: 'weather',
    description: 'Get the current Temperature & Weather at a specific Location.',
    args: true,
    minparams: 2,
    cooldown: 60,
    aliases: ['temp', 'temperature'],
    usage: '<city> <country code>',
	// eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl) {
        let allargs;
        for(let q = 0; q < args.length - 1; q++) {
            if(q == 0) {
                allargs = args[q];
            }else{
                allargs += ' ' + args[q];
            }
        }
        const query = 'http://api.openweathermap.org/data/2.5/weather?q=' + allargs + ',' + args[args.length - 1] + '&APPID=' + owmapikey + '&units=metric';
        const body = await fetch(query).then(response => response.json());
        if(body.cod == '404') {
            const resultEmbed = new Discord.RichEmbed()
            .setTitle(`${cl.user.username} Weather Report`)
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription('This City was not found in our system. Please try again with another query.')
            .setFooter(msg.author.tag);
            msg.channel.send(resultEmbed);
        }else{
            const desc = (body['weather'][0].description).substring(0, 1).toUpperCase() + body['weather'][0].description.substring(1);
            const resultEmbed = new Discord.RichEmbed()
            .setTitle(`${cl.user.username} Weather Report`)
            .setThumbnail('https://openweathermap.org/img/wn/' + body['weather'][0].icon + '@2x.png')
            .setTimestamp()
            .setColor('RANDOM')
            .addField('Temperature °C', Math.round(body['main'].temp), true)
            .addField('Weather', desc, true)
            .setDescription(`Weather Report for ${allargs}`)
            .setFooter(msg.author.tag);
            msg.channel.send(resultEmbed);
        }
	},
};