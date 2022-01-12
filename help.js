module.exports = {
  'help': {
    description: 'Shows the list of commands or help on specified command.',
    format: '-help [command-name]'
  },
  'ping': {
    description: 'Checks connectivity with discord\'s servers.',
    format: '-ping'
  },
  'say': {
    description: 'Repeats whatever is said',
    format: '-say <message>'
  },
  'teach': {
    description: 'Add forbidden word to block',
    format: '-teach <bad-word>'
  },
  'unteach': {
    description: 'Remove forbidden word to block',
    format: '-unteach <bad-word>'
  },
  'pvp': {
    description: 'Get Halo Infinite Multiplayer PVP game stats via gamertag',
    format: '-pvp <Halo-gamertag>'
  },
  'social': {
    description: 'Get Halo Infinite Multiplayer Social game stats via gamertag',
    format: '-social <Halo-gamertag>'
  },
  'ranked': {
    description: 'Get Halo Infinite Multiplayer Ranked game stats via gamertag',
    format: '-ranked <Halo-gamertag>'
  },
  'bots': {
    description: 'Get Halo Infinite Multiplayer Bots game Stats via gamertag',
    format: '-bots <Halo-gamertag>'
  },
  'custom': {
    description: 'Get Halo Infinite Multiplayer Custom game stats via gamertag',
    format: '-custom <Halo-gamertag>'
  },
}