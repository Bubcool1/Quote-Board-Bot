const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
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
		client.guilds.cache.get('855023117348765728')?.commands.set(data).then(function(result) {
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
					element.votes = 0
					quoteNumber.push(element);
				});
			}
		}
	}
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId == 'downvote') {
		await interaction.reply('Downvote Pressed');
		await wait(1500);
		await interaction.deleteReply();
		// TODO: get id of the button being pressed. Then the message id then change the value in quoteNumber accordingly. After that check what needs to be done with the quote.
		for (var i = 0; i < quoteNumber.length; i++) {
			if (quoteNumber[i].ID == interaction.message.id) {
				quoteNumber[i].votes -= 1;
				console.log(quoteNumber[i].votes);
				console.log(quoteNumber[i].ID);
			};
		};
    };
    if (interaction.customId == 'upvote') {
		await interaction.reply('Upvote Pressed');
		await wait(1500);
		await interaction.deleteReply();
		// TODO: get id of the button being pressed. Then the message id then change the value in quoteNumber accordingly. After that check what needs to be done with the quote.
		for (var i = 0; i < quoteNumber.length; i++) {
			if (quoteNumber[i].ID == interaction.message.id) {
				quoteNumber[i].votes += 1;
				console.log(quoteNumber[i].votes);
				console.log(quoteNumber[i].ID);
			};
		};
    };
});

client.login(process.env.TOKEN);