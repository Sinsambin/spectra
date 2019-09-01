const Discord = require('discord.js');
const { botowner } = require('../config.json');
module.exports = {
	name: 'tag',
	description: 'The Tag system. Create, save, delete, execute tags!' +
	'\nadd/a: create Tags. You have to specify the tag name and the content.' +
	'\nedit/e: You can edit your Tag. You have to specify tag name and new description.' +
	'\ninfo/i: See informations about a specific Tag.' +
	'\nlist/l: See all your Tags you\'ve created so far. See all existing tags with the all/a parameter.' +
	'\ndelete/d: Delete your Tag. This is irreversible and cannot be undone.',
	ownerOnly: false,
	aliases: ['t'],
	usage: '[add/edit/info/list/delete] [Tag name] [Tag content]',
	tags: true,
	args: true,
	minparams: 1,
	//eslint-disable-next-line no-unused-vars
	async execute(msg, args, cl, Tags) {
		const owncl = await cl.fetchUser(botowner);
		const owner = `${owncl.tag}`;
		if(((args[0] == 'add' || args[0] == 'a' || args[0] == 'edit' || args[0] == 'e' || args[0] == 'info' || args[0] == 'i' || args[0] == 'delete' || args[0] == 'd' || args[0] == 'raw2' || args[0] == 'r') && args.length > 1) || args[0] == 'list' || args[0] == 'l') {
			const tag = args[1].toLowerCase();
			let tagDesc;
			let icount = 2;
			while(icount < args.length) {
				if(icount == 2) {
					tagDesc = args[icount];
				}else {
					tagDesc += ' ' + args[icount];
				}
				icount++;
			}

			//Tag adding
			if(args[0] == 'add' || args[0] == 'a') {
				try{
					const newtag = await Tags.create({
						name: tag,
						description: tagDesc,
						userid: msg.author.id,
						usertag: msg.author.tag,
					});
					return msg.channel.send(`Tag ${newtag.name} has been successfully added.`);
				}catch(e) {
					if (e.name === 'SequeliteUniqueConstraintError') {
						return msg.channel.send('This tag already exists.');
					}
					return msg.channel.send(`:warning: The tag ${tag} already exists.`);
				}

			//Tag edits
			}else if(args[0] == 'edit' || args[0] == 'e') {
				const rows = await Tags.update({ description: tagDesc }, { where: { name: tag } });
				if(rows > 0) return msg.channel.send(`Tag ${tag} has been successfully edited.`);
				return msg.channel.send(`Tag ${tag} does not exist.`);

			//Tag Infos
			}else if(args[0] == 'info' || args[0] == 'i') {
				const taginfo = await Tags.findOne({ where: { name: tag } });
				if(taginfo) {
					const infoEmbed = new Discord.RichEmbed()
						.setTitle(`Information about the ${tag} Tag!`)
						.setThumbnail(cl.user.avatarURL)
						.setColor('RANDOM')
						.setFooter(msg.author.tag + ` | ${cl.user.username} Tag System`)
						.setTimestamp()
						.addField('Tag Name', `${tag}`, true)
						.addField('Tag Owner', `${taginfo.usertag}`, true)
						.addField('Created at', `${taginfo.createdAt}`, true)
						.addField('Uses', `This tag was used ${taginfo.usage_count} times.`, true);
					return msg.channel.send(infoEmbed);
				}
				return msg.channel.send(`Tag ${tag} does not exist.`);

			//Tag List
			}else if(args[0] == 'list' || args[0] == 'l') {
				if(args.length > 1 && (args[1] == 'a' || args[1] == 'all')) {
					const taglist = await Tags.findAll({ attributes: ['name'] });
					const alltags = taglist.map(t => t.name).join(', ') || 'There are no tags so far.';
					return msg.channel.send('All Tags:\n```' + `${alltags}` + '```');
				}else{
					const taglist = await Tags.findAll({ where: { userid: msg.author.id } });
					const alltags = taglist.map(t => t.name).join(', ') || 'You didnt create any tags so far.';
					return msg.channel.send('Your Tags:\n```' + `${alltags}` + '```');
				}

			//Tag Deleting
			}else if(args[0] == 'delete' || args[0] == 'd') {
				let tbdeleted;
				if(msg.author.id == botowner) {
					tbdeleted = await Tags.destroy({ where: { name: tag } });
				}else{
					tbdeleted = await Tags.destroy({ where: { name: tag, userid: msg.author.id } });
				}
				if(!tbdeleted) return msg.channel.send('You can\'t delete tags that dont exist or tags you don\'t own!');
				return msg.channel.send('Tag ' + args[1] + ' was deleted successfully!');

			//Tag Raw
			}else if(args[0] == 'raw2' || args[0] == 'r') {
				const findtag = await Tags.findOne({ where: { name: args[1] } });
				if(findtag) {
					findtag.increment('usage_count');
					return msg.channel.send('```' + findtag.get('description') + '```');
				}
				return msg.channel.send(`Tag ${args[1]} does not exist.`);
			}

		//Tag calling
		}else{
			const findtag = await Tags.findOne({ where: { name: args[0].toLowerCase() } });
			if(findtag) {
				findtag.increment('usage_count');
				return msg.channel.send(findtag.get('description'));
			}
			return msg.channel.send(`Tag ${args[0]} does not exist.`);
		}
	},
};