# 343 Guilty Spark Discord Bot

## About
A Discord Bot that does things.

### Things and stuff that it depends on:

1. [FreeCodeCamp](https://www.freecodecamp.org/news/create-a-discord-bot-with-javascript-nodejs/) guide

1. [Replit's](https://www.replit.com) and it's discord.js starter template for easy quickstart on Discord Bot and discord.js

1. [UptimeRobot's](https://uptimerobot.com/) to maintain hosting of the Discord Bot's web server.

1. [Autocode Halo Infinite API](https://autocode.com/lib/halo/infinite/) for  Halo Infinite stats retrieval


## Features
1. [x] Blocks anti-gay speech and other forbidden words 
1. [x] Teach bot forbidden words
1. [x] Unteach bot forbidden words
1. [ ] Kick users who are too anti-gay into a Discord jail text channel for 1 day
1. [x] Show Halo Infinite Multiplayer stats - Phase 1 (KDA, KDR, Total Score, Win Rate, "Noobness")
1. [ ] Show Halo Infinite Multiplayer stats - Phase 2 (Medals, Betrayals, Suicides, Vehicles Destroyed, Vehicles Hijacked)
1. [ ] Show Halo Infinite Multiplayer stats - Phase 3 (Beautify)
1. [ ] Show Halo Infinite Multiplayer Medal breakdown
1. [ ] Show Halo Infinite Multiplayer profile appearance along with any Halo Infinite Multiplayer commands

## Commands
You can edit commands and add more in `index.js` file.
The help command also depends on the `help.js` file. This file contains the data that the help command displays.

After creating a new command in `index.js`, go to `help.js` and add a new key-value pair to the JSON Object in the format shown below.
```JS
{
  ...,
  'command-name': {
    aliases: ['these', 'are', 'optional'],
    description: 'This command does xyz...',
    format: 'command-name <my-args>'
}
```

Here, `command-name` is the name of your command. `aliases` is an array of command's aliases. Note that these aliases don't take effect in the bot, they are only here to be displayed in the help command, to make these take effect, use multiple `case` statements as shown for the `say` command in `index.js`. Also the `aliases` field is optional here.
Nextly, `description` and `format` field are necessary or it will break the help command.
`description` is a short description of what the command does.
`format` shows how is the user supposed to use the command. The first word is always the command name (`command-name`) followed by the arguments separated by a space (` `). The optional command arguments are enclosed within square brackets (`[]`) and the required arguments are enclosed within angular brackets (`<>`). The prefix is automatically added while displayng in the help command so be sure to not use it here.