const { Client, MessageEmbed } = require('discord.js');
const config = require('./config');
const commands = require('./help');
const keepAlive = require("./server");
const lib = require('lib')({token: process.env['AUTOCODE_TOKEN']});

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
  const parseMedalsBreakdown = (medalsBreakdown) => {
    const top3Medals = [medalsBreakdown[0], medalsBreakdown[1], medalsBreakdown[2]];

    for (i = 3; i < medalsBreakdown.length; i++) {
      for (j = 0; j < top3Medals.length; j++) {
        if (medalsBreakdown[i].count > top3Medals[j].count) {
          console.log("replacing " + top3Medals[j] + " with " + medalsBreakdown[i]);
          // top3Medals[j] = medalsBreakdown[i];
          top3Medals.splice(j, 1, medalsBreakdown[i]);
          console.log("replaced to:" + top3Medals[j]);
          break;
        }
      }
    }

    return top3Medals;
  }

  const replyHaloStats = (stats) => {
    const { core, matches_played, win_rate } = stats;
    const { kda, kdr, medals, total_score, summary, shots, breakdowns } = core;
    const top3Medals = parseMedalsBreakdown(breakdowns.medals);

    message.channel.send(
      "---------------\n" +
      "- KDA: " + kda.toString().substring(0,8) + "\n" +
      "- KDR: " + kdr.toString().substring(0,8) + "\n" +
      "- Total score: " + total_score + "\n" +
      "- Win rate: " + win_rate.toString().substring(0,8) + "%\n" +
      "- Accuracy: " + shots.accuracy.toString().substring(0,8) + "%\n" + 
      "---------------\n" +
      // TODO Summary
        // Average kills / deaths / assists / vehicles destoryed / vehicles hijacked / medals per game
        // betrayals / suicides 
      "- Kills/game: " + (summary.kills / matches_played).toString().substring(0,8) + "\n" +
      "|- Melee-kills/game: " + (breakdowns.kills.melee / matches_played).toString().substring(0,8) + "\n" +
      "|- Nade-kills/game: " + (breakdowns.kills.grenades / matches_played).toString().substring(0,8) + "\n" +
      "|- Headshot-kills/game: " + (breakdowns.kills.headshots / matches_played).toString().substring(0,8) + "\n" +
      "- Deaths/game: " + (summary.deaths / matches_played).toString().substring(0,8) + "\n" +
      "- Assists/game: " + (summary.assists / matches_played).toString().substring(0,8) + "\n" +
      "|- Driver-assists/game: " + (breakdowns.assists.driver / matches_played).toString().substring(0,8) + "\n" +
      "- Vehicle-hijacks/game: " + (summary.vehicles.hijacks / matches_played).toString().substring(0,8) + "\n" +
      "- Vehicle-kills/game: " + (summary.vehicles.destroys / matches_played).toString().substring(0,8) + "\n" +
      "- Medals/game: " + (summary.medals / matches_played).toString().substring(0,8) + "\n" +
      "- Betrayals: " + (summary.betrayals) + "\n" +
      "- Suicides: " + (summary.suicides) + "\n" +
      "---------------\n" +
      "Top 3 medals:\n" +
      top3Medals[0].name + " (" + top3Medals[0].count + ")\n" +
      top3Medals[1].name + " (" + top3Medals[1].count + ")\n" +
      top3Medals[2].name + " (" + top3Medals[2].count + ")\n" +
      "---------------\n",
      {files: [
        top3Medals[0].image_urls.small,
        top3Medals[1].image_urls.small,
        top3Medals[2].image_urls.small,
      ]}
    );
  }
  ////

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
          
          replyHaloStats(result.data);
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
////

bot.login(config.token);

// To keep web server up via Uptime Robot
keepAlive();