const Discord = require('discord.js');
const Sequelize = require('sequelize');
const cl = new Discord.Client();
const { prefix, altprefix, token, botowner, game } = require('./config.json');
const fs = require('fs');
cl.commands = new Discord.Collection();
const allCommands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

//Loads all the Commands
for(const file of allCommands) {
  const cmd = require(`./commands/${file}`);
  cl.commands.set(cmd.name, cmd);
}

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  //operatorsAliases: false,
  storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  userid: Sequelize.STRING,
  usertag: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

const OsuAccLink = sequelize.define('osuacclink', {
  osuid: {
    type: Sequelize.STRING,
    unique: true,
  },
  discordid: {
    type: Sequelize.STRING,
    unique: true,
  },
});

//Confirms the startup
cl.once('ready', () => {
  Tags.sync();
  OsuAccLink.sync();
  console.log(`Logged in as ${cl.user.tag}!`);
  console.log('Successfully started up!\n\n');
  const channel = cl.channels.get('442432350446551051');
  if(channel.guild.me.permissions.has('ADMINISTRATOR')) channel.send(`${cl.user.tag} is now <@&442107829017378836>\nConnected to *${cl.guilds.size}* Servers`);
  cl.user.setActivity(game, { type: 'LISTENING' });
  cl.user.setStatus('online');
});

cl.on('message', msg => {

  //logs every message
  console.log(msg.author.tag + ': ' + msg.content);

  //prevents non bot messages
  if ((!msg.content.startsWith(prefix) && !msg.content.startsWith(altprefix)) || msg.author.bot) return;

  // saves arguments and using regex to prevent accidal spaces which would count as single arguments
  const args = msg.content.slice(prefix.length).split(/ +/);
  const cmdName = args.shift().toLowerCase();

  //saves command object
  const cmd = cl.commands.get(cmdName) || cl.commands.find(cmd2=>cmd2.aliases && cmd2.aliases.includes(cmdName));

  //prevent Non-existing / disabled commands
  if(!cmd || cmd.disabled) {
    return;
  }

  //Checks if the Command is Owner-Only
  if(cmd.ownerOnly && !(msg.author.id === botowner)) {
    return;
  }

  //checks if the command is guild-only
  if(cmd.guildOnly && msg.channel.type !== 'text') {
    return msg.reply('I\'m not able to execute this command inside DM\'s!');
  }

  //checks for parameters and dynamically creates error messages.
  if(cmd.args && !args.length) {
    let reply = `You provided invalid or no parameters ${msg.author}!`;
    if(cmd.usage) {
      reply += '\nSyntax: ' + prefix + `${cmd.name} ${cmd.usage}`;
    }
    return msg.channel.send(reply);
  }

  if(cmd.minparams) {
    if(cmd.minparams > args.length) {
      let reply = `You provided too few arguments ${msg.author}!`;
      if(cmd.usage) {
        reply += '\nSyntax: ' + prefix + `${cmd.name} ${cmd.usage}`;
      }
      return msg.channel.send(reply);
    }
  }

  //checks if the command needs mention
  if(cmd.args && cmd.mention && (msg.mentions.users.size == 0)) {
    let reply2 = `You need to mention / Tag a User to execute this command ${msg.author}!`;
    if(cmd.usage) {
      reply2 += '\nSyntax: ' + prefix + `${cmd.name} ${cmd.usage}`;
    }
    return msg.channel.send(reply2);
  }

  //executes commands if there is no cooldown active
  if(!cooldowns.has(cmd.name)) {
    cooldowns.set(cmd.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(cmd.name);
  //If the command has a cooldownprotection, it is set here, else no cooldown is set.
  const cooldownAmount = (cmd.cooldown || 0) * 1000;

  if(timestamps.has(msg.author.id)) {
    const expTime = timestamps.get(msg.author.id) + cooldownAmount;
    if(now < expTime) {
      const timeLeft = (expTime - now) / 1000;
      return msg.reply(`This command is currently in cooldown. Please wait another ${timeLeft.toFixed(1)} second(s) before using the command again.`);
    }
  }

  //Checks if cooldown is expired
  timestamps.set(msg.author.id, now);
  setTimeout(()=> timestamps.delete(msg.author.id), cooldownAmount);

  try{
    if(cmd.tags) {
      cmd.execute(msg, args, cl, Tags);
    }else if(cmd.register) {
      cmd.execute(msg, args, cl, OsuAccLink);
    }else{
      cmd.execute(msg, args, cl);
    }
  }catch (error) {
    console.error(error);
    msg.reply('I\'m sorry, but an error happened while executing the command.');
  }
});

cl.on('guildMemberAdd', async member => {
  const channel = member.guild.channels.find(c => c.name == 'serverlog');
  if (!channel) return;
  const newmem = await cl.fetchUser(member.id);
  channel.send(`<:plusone:595216868998905857> **${newmem.tag}(${member.id})** just joined our server!`);
});

cl.on('guildMemberRemove', async member => {
  const channel = member.guild.channels.find(c => c.name == 'serverlog');
  if (!channel) return;
  const oldmem = await cl.fetchUser(member.id);
  channel.send(`<:minusone:595216868990779444> **${oldmem.tag}(${member.id})** just left/got kicked from our server... `);
});

cl.on('guildCreate', async guild => {
  const owner = await cl.fetchUser(botowner);
  const alertEmbed = new Discord.RichEmbed()
    .setTitle('New Guild!')
    .setTimestamp()
    .setThumbnail(guild.iconURL)
    .setColor('GREEN')
    .addField('Guild Name', guild.name)
    .addField('Owner', `${guild.owner.user.tag} (${guild.owner.user.id})`)
    .addField('Member Count', guild.memberCount)
    .addField('Guild ID', guild.id);
    owner.send(alertEmbed);
});

cl.on('guildDelete', async guild => {
  const owner = await cl.fetchUser(botowner);
  const alertEmbed = new Discord.RichEmbed()
    .setTitle('Guild Left...')
    .setTimestamp()
    .setThumbnail(guild.iconURL)
    .setColor('RED')
    .addField('Guild Name', guild.name)
    .addField('Owner', `${guild.owner.user.tag} (${guild.owner.user.id})`)
    .addField('Member Count', guild.memberCount)
    .addField('Guild ID', guild.id);
    owner.send(alertEmbed);
});

cl.on('messageUpdate', (oldmsg, newmsg) => {
  if(!oldmsg.author.bot) {
    const channel = oldmsg.guild.channels.find(c => c.name == 'serverlog');
	if(!channel)return;
    channel.send(` ⚠ **${oldmsg.author.tag}** edited their message:`);
    const updateEmbed = new Discord.RichEmbed()
    .setColor('GOLD')
    .addField('Before', oldmsg)
    .addField('After', newmsg)
    .setTimestamp();
    channel.send(updateEmbed);
  }
});

cl.on('messageDelete', delmsg => {
  if(!delmsg.author.bot) {
    const channel = delmsg.guild.channels.find(c => c.name == 'serverlog');
	if(!channel)return;
    channel.send(` ❌ **${delmsg.author.tag}** deleted their message:`);
    const deleteEmbed = new Discord.RichEmbed()
    .setColor('#FF0000')
    .addField('deleted message', delmsg)
    .setTimestamp();
    channel.send(deleteEmbed);
  }
});

cl.on('resume', eventnr => {
  const channel = cl.channels.get('442432350446551051');
  if(channel.guild.me.permissions.has('ADMINISTRATOR')) channel.send(`${cl.user.tag} has <@&595242688446726145>\nDowntime: ${eventnr}ms.`);
});

cl.on('reconnecting', replayed => {
  const channel = cl.channels.get('442432350446551051');
  if(channel.guild.me.permissions.has('ADMINISTRATOR')) channel.send(`${cl.user.tag} has <@&595242874350731265>\nDowntime: ${replayed}ms.`);
});

cl.on('disconnect', async event => {
  const owner = await cl.fetchUser(botowner);
  const channel = cl.channels.get('442432350446551051');
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
  if(channel.guild.me.permissions.has('ADMINISTRATOR')) channel.send(`${cl.user.tag} is now going <@&442108013021626376>\nUptime: ${time}`);
  owner.send(`${cl.user.tag} is now going <@&442108013021626376>\nReason: \`${event}\``);
});

cl.on('voiceStateUpdate', (oldmem, newmem) => {
	if(oldmem.bot) return;
  const channel = oldmem.guild.channels.find(c => c.name == 'serverlog');
	// if(!channel || oldmem.voiceChannel.name == newmem.voiceChannel.name)return;
  if(!oldmem.voiceChannel && newmem.voiceChannel) {
    channel.send(` ⤵ **${newmem.user.tag} (${newmem.user.id})** has joined voice channel *${newmem.voiceChannel.name}*.`);
  } else if(oldmem.voiceChannel && !newmem.voiceChannel) {
    channel.send(` ⤴ **${oldmem.user.tag} (${oldmem.user.id})** has left voice channel *${oldmem.voiceChannel.name}*.`);
  } else {
	if(oldmem.voiceChannel.name == newmem.voiceChannel.name) return;
    channel.send(`🔄 **${oldmem.user.tag} (${oldmem.user.id})** has switched voicechannels from *${oldmem.voiceChannel.name}* to *${newmem.voiceChannel.name}.*`);
  }
});

cl.login(token);