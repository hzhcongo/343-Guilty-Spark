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
}