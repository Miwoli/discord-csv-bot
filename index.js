const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
const csvWriter = require('csv-write-stream')

const token = require('./token.json').token

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(token)

client.on('message', msg => {
  const channel = msg.channel.name

  const content = [
    msg.content.match('Name: ((.|\n)*)Type:'),
    msg.content.match('Type: ((.|\n)*)Details:'),
    msg.content.match('Details: ((.|\n)*)')
  ]

  if (content[0] && content[1] && content[2]) {

    let csv = csvWriter()

    if (!fs.existsSync('result.csv'))
      csv = csvWriter({ headers: ['channel', 'name', 'type', 'details']});
    else
      csv = csvWriter({sendHeaders: false});

    csv.pipe(fs.createWriteStream('result.csv', {flags: 'a'}))
    csv.write({
      channel: msg.channel.name,
      name: content[0][1],
      type: content[1][1],
      details: content[2][1]
    })
    csv.end()
  }
})