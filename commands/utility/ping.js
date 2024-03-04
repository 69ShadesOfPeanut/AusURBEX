// Command for seeing the ping of the bot

const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the bot latency'),
    
    async execute(interaction, client) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true })

        interaction.editReply(`Pong! Bot latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms || Websocket heartbeat: ${client.ws.ping}ms`)
    }
}