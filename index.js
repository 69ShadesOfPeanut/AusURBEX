// Require the necessary discord.js classes
const fs = require('node:fs')
const path = require('node:path')
const { Client, Collection, Events, GatewayIntentBits, InteractionCollector, ActivityType } = require('discord.js')
const { token } = require('./config.json')

// create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection()


// Dynamically retrieves command files
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        // Set a new item in the collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
        }
    }
}


// Retrieves command interactions and executes them. Catches any errors while executing the commands and puts them into the console
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return
    
    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found`)
        return
    }

    try {
        await command.execute(interaction, client)
    } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
    }
})



// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)

    // Set bot status
    client.user.setActivity('Aus Urbex', { type: ActivityType.Listening })
})


// Log into Discord with your client token
client.login(token)