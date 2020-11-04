const Discord = require('discord.js');
const client = new Discord.Client();

var tickname = ["✅"];
var crossname = ["❌"];
var quotenumber = 0

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
    global.fullmessage = "Is this a good quote: " + args
    msg.delete({ timeout: 1 })
    msg.channel.send(fullmessage)
  });

  client.on('message', msg => {
  if (msg.content === fullmessage) {
    msg.react('✅')
    msg.react('❌')
    }
  });

  client.on("messageReactionAdd", (reaction, user) => {
    if (!user) return;
    if (user.bot) return;
    if (!reaction.message.channel.guild) return;
    for (let n in tickname) {
      if (reaction.emoji.name == tickname[n]) {
          // FIXME: when this is called, delete the message after the specified amount of votes then post the actual thing.
          // TODO: Make the vote off thing where 2-5 good votes gets it posted -2-5 votes gets it yeeted
        msg.delete({ timeout: 1 })  
        msg.channel.send(args)
      }
    }
  });

  client.on("messageReactionAdd", (reaction, user) => {
    if (!user) return;
    if (user.bot) return;
    if (!reaction.message.channel.guild) return;
    for (let n in crossname) {
      if (reaction.emoji.name == crossname[n]) {
          // FIXME: when this is called yeet the message and do nothing
          // TODO: Make the vote off thing where 2-5 good votes gets it posted -2-5 votes gets it yeeted
          quotenumber -= 1
          msg.delete({ timeout: 1 })  
      }
    }
  });


// Make it so each reaction adds to a number, if the number reaches +5 then itll add it, if it reaches -5 it wont tick obv +1 'x' -1

// client.login(process.env.token);

// Added for local testing
const TOKEN = process.env.TOKEN;
client.login(TOKEN);