const Discord = require('discord.js');
const client = new Discord.Client();

var tickName = ["✅"];
var crossName = ["❌"];
var quoteNumber = 0
global.fullmessage = ""

// Added for local testing
require('dotenv').config()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('ready', () => {
  console.log('Bot: Hosting ' + `${client.users.size}` + ' users, in ' + `${client.channels.size}` + ' channels of ' + `${client.guilds.size}` + ' guilds.');
      client.user.setStatus('online')
      client.user.setPresence({
          game: {
              name: 'quote-board',
              type: "Watching",
              url: "http://obeardsall.media/wat/"
          }
      });
  });

  client.on('message', msg => {
  if (!msg.content.startsWith('!quote') || msg.author.bot) return;
    global.args = msg.content.slice(7).trim();

    if (args == "") {
      msg.channel.send("Please provide a quote and try again.")
    }
    else {
      global.fullmessage = "Is this a good quote: " + args;
      // TODO: make args get added to voteCounts[args] with the number of 0
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

  client.on('message', msg => {
    if (msg.content === "!addvote") {
      quoteNumber += 1;
      }
    });
    client.on('message', msg => {
      if (msg.content === "!remvote") {
        quoteNumber -= 1;
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
          client.channels.cache.get('776871179192893490').send("The quote has been posted."); // Confirmation about the quotes acceptance.
          client.channels.cache.get(`773483611881603092`).send(args) // Sending the quote to the main quote-board channel.
          .then(msg => client.destroy())
          .then(() => client.login(TOKEN));
          console.log(quoteNumber);
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
      if (quoteNumber == -1) {
        quoteNumber = 0;
        msg.delete(1); // FIXME: After the deleted message issue is fixed change the below '-1' to '-2'
        client.channels.cache.get('776871179192893490').send("The quote has been rejected."); // Confirmation to the main channel about rejection.
        client.channels.cache.get(`776919202652094500`).send(args) // A channel to send the rejects to
        .then(msg => client.destroy())
        .then(() => client.login(TOKEN));
        console.log(quoteNumber);
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


// TODO: Make it so each reaction adds to a number, if the number reaches +5 then itll add it, if it reaches -5 it wont tick obv +1 'x' -1

// client.login(process.env.token);

// Added for local testing
const TOKEN = process.env.TOKEN;
client.login(TOKEN);
