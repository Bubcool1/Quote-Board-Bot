const Discord = require('discord.js');
const client = new Discord.Client();

// var upName = ["✅"];
// var downName = ["❌"];
var upName = ["👍"];
var downName = ["👎"];
var quoteNumber = 0


require('dotenv').config()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('ready', () => {
  console.log('Bot: Hosting ' + `${client.users.cache.size}` + ' users, in ' + `${client.channels.cache.size}` + ' channels of ' + `${client.guilds.cache.size}` + ' guilds/servers.');
  client.user.setStatus('online')
  client.user.setActivity('quote-board', {
    type: 'Watching'
  })
});

  client.on('message', msg => {
  if (!msg.content.startsWith('!quote') || msg.author.bot) return;
    global.args = msg.content.slice(7).trim();

    if (args == "") {
      msg.channel.send("Please provide a quote and try again.")
    }
    else {
      quoteNumber = 0;
      msg.delete({ timeout: 1 });
      msg.channel.send("Is this a good quote: " + args).then(msg => {
        msg.react("👍")
        msg.react("👎")
      })
    }
  });

  client.on('message', msg => {
  if (msg.content === '!qissue') {
    msg.channel.send("https://github.com/Bubcool1/Quote-Board-Bot/issues");
    }
  })

  client.on("messageReactionAdd", (reaction, user, msg) => {
    if (!user) return;
    if (user.bot) return;
    if (!reaction.message.channel.guild) return;
    for (let n in upName) {
      if (reaction.emoji.name == upName[n]) {
        if (quoteNumber == 5) {
        // if (quoteNumber == 0) {
          quoteNumber = 0;
          reaction.message.delete();
          try {
            const requestsChannel = reaction.message.guild.channels.cache.find(channel => channel.name == "quote-board-requests");
            requestsChannel.send("The quote has been posted.");
          } catch(e) {console.log("Someone doesn't have requests.")};
          try {
            const boardChannel = reaction.message.guild.channels.cache.find(channel => channel.name == "quote-board");
            boardChannel.send(args);
          } catch(e) {console.log("Someone doesn't have board.")};
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
    for (let n in upName) {
      if (reaction.emoji.name == upName[n]) {
        quoteNumber -= 1;
        console.log("Someone removed their vote " + quoteNumber)
      }
    }
    for (let n in downName) {
      if (reaction.emoji.name == downName[n]) {
        quoteNumber += 1;
        console.log("Someone removed their vote " + quoteNumber)
      }
    }
  });


client.on("messageReactionAdd", (reaction, user, msg) => {
  if (!user) return;
  if (user.bot) return;
  if (!reaction.message.channel.guild) return;
  for (let n in downName) {
    if (reaction.emoji.name == downName[n]) {
      if (quoteNumber == -2) {
      // if (quoteNumber == 0) {
        quoteNumber = 0;
        reaction.message.delete()
        
        try {
          const requestsChannel = reaction.message.guild.channels.cache.find(channel => channel.name == "quote-board-requests")
          requestsChannel.send("The quote has been rejected.")
        } catch(e) {console.log("Someone doesn't have requests.")}
        try {
          const rejectsChannel = reaction.message.guild.channels.cache.find(channel => channel.name == "quote-board-rejects")
          rejectsChannel.send(args)
        } catch(e) {console.log("Someone doesn't have rejects.")}
      }
      else {
        quoteNumber -= 1;
        console.log(quoteNumber)
      }
    }
  }
});

client.login(process.env.TOKEN);