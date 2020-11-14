const Discord = require('discord.js');
const client = new Discord.Client();

var tickName = ["✅"];
var crossName = ["❌"];
var quoteNumber = 0
global.fullmessage = ""
var quoteBoardReq = "676679581847126016"
var quoteBoard = "776921359624175616"
var quoteBoardRejects = "776927057861935124"


// Added for local testing
require('dotenv').config()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('ready', () => {
  console.log('Bot: Hosting ' + `${client.users.size}` + ' users, in ' + `${client.channels.size}` + ' channels of ' + `${client.guilds.size}` + ' guilds.');
      client.user.setStatus('online')
      client.user.setActivity('quote-board', { type: 'Watching' })
  });

  client.on('message', msg => {
  if (!msg.content.startsWith('!quote') || msg.author.bot) return;
    global.args = msg.content.slice(7).trim();

    if (args == "") {
      msg.channel.send("Please provide a quote and try again.")
    }
    else {
      global.fullmessage = "Is this a good quote: " + args;
      quoteNumber = 0;
      msg.delete({ timeout: 1 });
      msg.channel.send(fullmessage)
      .then(msg => msg.react('❌'));
    }
  });

  client.on('message', msg => {
  if (msg.content === fullmessage) {
    msg.react('✅');
    }
  });

  client.on("messageReactionAdd", (reaction, user, msg) => {
    if (!user) return;
    if (user.bot) return;
    if (!reaction.message.channel.guild) return;
    for (let n in tickName) {
      if (reaction.emoji.name == tickName[n]) {
        if (quoteNumber == 5) {
          quoteNumber = 0;
          reaction.message.delete()
          client.channels.cache.get(quoteBoardReq).send("The quote has been posted."); // Confirmation about the quotes acceptance.
          client.channels.cache.get(quoteBoard).send(args) // Sending the quote to the main quote-board channel.
        }
        else {
          quoteNumber += 1;
          console.log(quoteNumber)
        }
      }
    }
  });


  client.on("messageReactionRemove", (reaction, user, msg) => {
    if (!user) return;
    if (user.bot) return;
    if (!reaction.message.channel.guild) return;
    for (let n in tickName) {
      if (reaction.emoji.name == tickName[n]) {
        quoteNumber -= 1;
        console.log("Someone removed their vote " + quoteNumber)
      }
    }
  });


client.on("messageReactionAdd", (reaction, user, msg) => {
  if (!user) return;
  if (user.bot) return;
  if (!reaction.message.channel.guild) return;
  for (let n in crossName) {
    if (reaction.emoji.name == crossName[n]) {
      if (quoteNumber == -2) {
        quoteNumber = 0;
        reaction.message.delete()
        client.channels.cache.get(quoteBoardReq).send("The quote has been rejected."); // Confirmation to the main channel about rejection.
        client.channels.cache.get(quoteBoardRejects).send(args) // A channel to send the rejects to
      }
      else {
        quoteNumber -= 1;
        console.log(quoteNumber)
      }
    }
  }
});

client.on("messageReactionRemove", (reaction, user, msg) => {
  if (!user) return;
  if (user.bot) return;
  if (!reaction.message.channel.guild) return;
  for (let n in crossName) {
    if (reaction.emoji.name == crossName[n]) {
      quoteNumber += 1;
      console.log("Someone removed their vote " + quoteNumber)
      
    }
  }
});



// client.login(process.env.token);

// Added for local testing
const TOKEN = process.env.TOKEN;
client.login(TOKEN);
