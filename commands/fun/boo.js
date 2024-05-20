// Command to send a random photo of Boo

const { SlashCommandBuilder } = require("discord.js")
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boo')
        .setDescription('Sends a random photo of Boo'),
    async execute(interaction) {
        // Get amount of Boo images
        const Length = fs.readdirSync('./Boo').length
        // console.log(`Amount of Boo images: ${Length}`)

        // Select random Boo image
        ImageNumber = Math.floor(Math.random() * Length + 1)
        //console.log(`Selected Boo image: ${ImageNumber}`)

        // Send Boo image
        await interaction.reply({files: [`./Boo/${ImageNumber}.jpg`]})
    }
}