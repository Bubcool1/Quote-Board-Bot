const { quote } = require('@discordjs/builders');
const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageManager } = require('discord.js');
const { waitForDebugger } = require('inspector');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const wait = require('util').promisify(setTimeout);


require('dotenv').config()

var quoteNumber = [];
// exports.quoteNumber = quoteNumber;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
		const data = [
			{
				name: 'quote',
				description: 'Requests a new quote.',
				options: [{
					name: 'quote',
					type: 'STRING',
					description: 'The quote',
					required: true,
					
				}, 
				{
					name: 'username',
					type: 'USER',
					description: 'The quote',
					required: true,
				}],
			},
		];

		// const commands = client.guilds.cache.get('855023117348765728')?.commands.set(data);
		// console.log(commands)
		client.guilds.cache.get('624200301770965043')?.commands.set(data).then(function(result) {
			console.log(result)
			message.channel.send("Deploy Complete")
		});		
	}
});

// Slash Command Response Code.
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'quote') {
		const quoteData = interaction.options.getString('quote');
		const usernameData = interaction.options.getUser('username');
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('upvote')
					.setLabel('Upvote')
					.setEmoji('👍')
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('downvote')
					.setLabel('Downvote')
					.setEmoji('👎')
					.setStyle('DANGER'),
			);
			const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Quote')
			.setDescription(quoteData)
			.setFooter(usernameData.username);

		await interaction.reply({ components: [row], embeds: [embed] });
	}
});

client.on('messageCreate', msg => {
	if (msg.embeds == null) return;
	// if (msg.embeds.title == 'Quote') {
	if (msg.embeds) {
		// console.log(msg.embeds.MessageEmbed.title);
		for (let embed of msg.embeds) { // these are some of the properties
			if (embed.title === 'Quote') {
				msg.channel.fetch().then(function(result) {
					// TODO: may be better to class this then have a array of class IDs then you can do the various things that need to be done here.
					var element = {}
					element.ID = result.lastMessageId
					element.desc = embed.description
					element.username = embed.footer.text
					element.upVotes = []
					element.downVotes = []
					quoteNumber.push(element);
				});
			}
		}
	}
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	if (interaction.customId == 'downvote') {
		userID = interaction.user.id
		// TODO: get id of the button being pressed. Then the message id then change the value in quoteNumber accordingly. After that check what needs to be done with the quote.
		for (var i = 0; i < quoteNumber.length; i++) {
			if (quoteNumber[i].ID == interaction.message.id) {
				if (!quoteNumber[i].downVotes.includes(userID)) {
					if (quoteNumber[i].upVotes.includes(userID)) {
						quoteNumber[i].upVotes.pop(userID);
						quoteNumber[i].downVotes.push(userID);
						await interaction.reply({content: 'You have changed your vote to down', ephemeral: true});
					} else {
						quoteNumber[i].downVotes.push(userID);
						await interaction.reply({content: 'Downvote Pressed', ephemeral: true});
					}
				} else {
					await interaction.reply({content: 'You have already voted negatively.', ephemeral: true });
				}

				console.log(quoteNumber[i].downVotes);
				console.log(quoteNumber[i].ID);
			};
			if (quoteNumber[i].downVotes.length == 2) {
			// if (quoteNumber[i].downVotes.length == 1) {
				interaction.message.delete(quoteNumber[i].ID);
				try {
					const rejectsChannel = interaction.guild.channels.cache.find(channel => channel.name == "quote-board-rejects");
					const quoteEmbed = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle('Rejected Quote')
						.setDescription(quoteNumber[i].desc)
						.setFooter(quoteNumber[i].username);
					//   boardChannel.send(quoteNumber[i].desc + ' - ' + quoteNumber[i].username);
					rejectsChannel.send({
						embeds: [quoteEmbed]
					});
					quoteNumber.pop(i)
				} catch (e) {
					console.log("Someone doesn't have rejects.");
				};
			
			};
		};
	};
	if (interaction.customId == 'upvote') {
		userID = interaction.user.id
		// TODO: get id of the button being pressed. Then the message id then change the value in quoteNumber accordingly. After that check what needs to be done with the quote.
		for (var i = 0; i < quoteNumber.length; i++) {
			if (quoteNumber[i].ID == interaction.message.id) {
				if (!quoteNumber[i].upVotes.includes(userID)) {
					if (quoteNumber[i].downVotes.includes(userID)) {
						quoteNumber[i].downVotes.pop(userID);
						quoteNumber[i].upVotes.push(userID);
						await interaction.reply({content: 'You have changed your vote to up', ephemeral: true});
					} else {
						quoteNumber[i].upVotes.push(userID);
						await interaction.reply({content: 'Upvote Pressed', ephemeral: true});
					}
				} else {
					await interaction.reply({content: 'You have already voted positively.', ephemeral: true});
				}

				console.log(quoteNumber[i].upVotes);
				console.log(quoteNumber[i].downVotes);
				console.log(quoteNumber[i].ID);
			};

			// Sending the quote to the correct channel if necessary. 
			if (quoteNumber[i].upVotes.length == 5) {
			// if (quoteNumber[i].upVotes.length == 1) {
				interaction.message.delete(quoteNumber[i].ID);
				try {
					const boardChannel = interaction.guild.channels.cache.find(channel => channel.name == "quote-board");
					const quoteEmbed = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle('Quote')
						.setDescription(quoteNumber[i].desc)
						.setFooter(quoteNumber[i].username);
					//   boardChannel.send(quoteNumber[i].desc + ' - ' + quoteNumber[i].username);
					boardChannel.send({
						embeds: [quoteEmbed]
					});
					quoteNumber.pop(i)
				} catch (e) {
					console.log("Someone doesn't have board.")
					interaction.message.send('Please create a channel called quote-board.')
				};

			};
		};
	};
});
client.login(process.env.TOKEN);