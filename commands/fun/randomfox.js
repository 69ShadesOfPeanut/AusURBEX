// Command to send a photo of a random fox

const { SlashCommandBuilder } = require("discord.js")
const { randomCatKey } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fox')
        .setDescription('Sends a random photo of a fox'),
    async execute(interaction) {
        // Headers and options for the fetch request
        const headers = new Headers({
            "Content-Type": "application/json"
        })
        
        const options = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        }

        // Fetch request
        const response = await fetch('https://randomfox.ca/floof/', options)
            .catch(err => console.error(err))
        
        const responseInfo = await response.json()
        
        // Display image
        console.log(responseInfo)
        await interaction.reply(`${responseInfo.image}`)
    }
}