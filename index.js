// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js')
const { token } = require('./config.json')

// create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

// Log into Discord with your client token
client.login(token)