// Command to send a photo of a random cat

const { SlashCommandBuilder } = require("discord.js")
const { randomCatKey } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Sends a random photo of a cat'),
    async execute(interaction) {
        // Headers and options for the fetch request
        const headers = new Headers({
            "Content-Type": "application/json",
            "x-api-key": randomCatKey
        })
        
        const options = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        }

        // Fetch request
        const response = await fetch('https://api.thecatapi.com/v1/images/search?format=json', options)
            .catch(err => console.error(err))
        
        const responseInfo = await response.json()
        
        // Display image
        //console.log(responseInfo)
        await interaction.reply(`${responseInfo[0].url}`)
    }
}