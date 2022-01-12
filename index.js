const { Client, MessageEmbed } = require('discord.js');
const config = require('./config');
const commands = require('./help');
const keepAlive = require("./server");
const lib = require('lib')({token: 'tok_dev_TxPfuZbNMwSyBLCYxVv6s9F9jXrmA1URYhmgfa8F1HMjWgbPjFEdgEJrRGfMed8b'});

let bot = new Client({
  fetchAllMembers: true, // Remove this if the bot is in large guilds.
  presence: {
    status: 'online',
    activity: {
      name: `everyone`,
      type: 'WATCHING',
    }
  }
});

bot.once('ready', () => console.log(`Logged in as ${bot.user.tag}.`));

let blacklistedWords = ['gay', 'g a y', 'g ay', 'ga y', 'g-a-y', 'g_a_y', 'g.a.y', 'ogay', 'dicks', 'cb', 'knn', 'wtf'];

bot.on('message', async message => {
  // Initialise semi-dependant logics
  const replyHaloStats = (kda, kdr, totalScore, winRate) => {
    message.reply(
      "KDA: " + kda + "\n" +
      "KDR: " + kdr + "\n" +
      "Total score: " + totalScore + "\n" +
      "Win rate: " + winRate + "%\n" +
      "Noobness: 100%" 
    );
  }

  // Command logic
  if (message.content.startsWith(config.prefix)) {
    let args = message.content.slice(config.prefix.length).split(' ');
    let command = args.shift().toLowerCase();

    try {
      switch (command) {

        case 'ping':
          let msg = await message.reply('Pinging...');
          await msg.edit(`PONG! Message round-trip took ${Date.now() - msg.createdTimestamp}ms.`)
          break;

        case 'say':
          if (args.length > 0)
            message.channel.send(args.join(' '));
          else
            message.reply('Why would you ask me to say nothing?')
          break

        case 'teach':
          if (args.length > 0) {

            blacklistedWords.push(args.join(' ').toLowerCase());
            message.reply(' bad word learnt');

            console.log(message.author + " is vulgar");
          }
          else
            message.reply('Why would you teach me nothing?')
          break

        case 'unteach':
          if (args.length > 0) {
            const badWordToRemove = args.join(' ').toLowerCase();
            const indexToRemove = blacklistedWords.indexOf(badWordToRemove);
            if (indexToRemove > -1) {
              blacklistedWords.splice(indexToRemove, 1);
              message.reply(' bad word unlearnt');
            } else {
              message.reply(badWordToRemove + ' is not a bad word currently');
            }
          }
          else
            message.reply('Why would you unteach me nothing?')
          break

        case 'pvp':
        case 'social':
        case 'ranked':
        case 'bots':
        case 'custom':
          let result = await lib.halo.infinite['@0.3.5'].stats['service-record'].multiplayer({
            gamertag: args.join(' '),
            filter: command === 'custom' ? command : 'matchmade:' + command
          });
          
          replyHaloStats(result.data.core.kda, result.data.core.kdr, result.data.core.total_score, result.data.win_rate);
          break;

        /* Unless you know what you're doing, don't change this command. */
        case 'help':
          let embed = new MessageEmbed()
            .setTitle('Commands')
            .setColor('PINK')
            .setFooter(`Requested by ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(bot.user.displayAvatarURL());
          if (!args[0])
            embed
              .setDescription(Object.keys(commands).map(command => `\`${command.padEnd(Object.keys(commands).reduce((a, b) => b.length > a.length ? b : a, '').length)}\` :: ${commands[command].description}`).join('\n'));
          else {
            if (Object.keys(commands).includes(args[0].toLowerCase()) || Object.keys(commands).map(c => commands[c].aliases || []).flat().includes(args[0].toLowerCase())) {
              let command = Object.keys(commands).includes(args[0].toLowerCase()) ? args[0].toLowerCase() : Object.keys(commands).find(c => commands[c].aliases && commands[c].aliases.includes(args[0].toLowerCase()));
              embed
                .setTitle(`COMMAND - ${command}`)

              if (commands[command].aliases)
                embed.addField('Command aliases', `\`${commands[command].aliases.join('`, `')}\``);
              embed
                .addField('DESCRIPTION', commands[command].description)
                .addField('FORMAT', `\`\`\`${config.prefix}${commands[command].format}\`\`\``);
            } else {
              embed
                .setColor('RED')
                .setDescription('This command does not exist. Please use the help command without specifying any commands to list them all.');
            }
          }
          message.channel.send(embed);
          break;
      }
    } catch (e) {
      console.log(e);
      message.reply('Rampancy: ' + e)
    }
    ////

  // Forbidden word check
  } else if (message.author != bot.user) {

    for (var i in blacklistedWords) {
      if (message.content.toLowerCase().includes(blacklistedWords[i].toLowerCase())) {
        await message.delete();
        await message.reply(' is a vulgar animal!"');

        console.log(message.author + " is vulgar");

        break;
      }
    }
  }
  ////
});

bot.login(config.token);

// To keep web server up via Uptime Robot
keepAlive();