const Discord = require('discord.js');
const { owmapikey } = require('../config.json');
const fetch = require('node-fetch');
module.exports = {
	name: 'weatherfc',
    description: 'Get the Temperature & Weather Forecast for a specific Location.',
    args: true,
    minparams: 2,
    cooldown: 60,
    aliases: ['tempfc', 'temperaturefc'],
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
        const query = 'http://api.openweathermap.org/data/2.5/forecast?q=' + allargs + ',' + args[args.length - 1] + '&APPID=' + owmapikey + '&units=metric' + '&cnt=8';
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
            for(let i = 0; i < body.list.length;i++) {
                const desc = (body.list[i]['weather'][0].description).substring(0, 1).toUpperCase() + body.list[i]['weather'][0].description.substring(1);
                const desc2 = allargs.substring(0, 1).toUpperCase() + allargs.substring(1);
                const date = new Date(body.list[i].dt * 1000);
                const hour = date.getHours();
                const min = '0' + date.getMinutes();
                const sec = '0' + date.getSeconds();
                const unixcoverted = hour + ':' + min.substr(-2) + ':' + sec.substr(-2);
                console.log(unixcoverted);
                const resultEmbed = new Discord.RichEmbed()
                .setTitle(`${cl.user.username} Weather Report`)
                .setThumbnail('https://openweathermap.org/img/wn/' + body.list[i]['weather'][0].icon + '@2x.png')
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription('Weather Forecast Report for ' + desc2 + '. Forecast Time: ' + unixcoverted)
                .addField('Temperature °C', Math.round(body.list[i]['main'].temp), true)
                .addField('Weather', desc, true)
                .setFooter(msg.author.tag);
                await msg.channel.send(resultEmbed);
                if(i == 3) msg.channel.send('Rest of Forecast is loading, please be patient...');
            }
        }
	},
};