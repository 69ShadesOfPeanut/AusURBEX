// Gives a list of users who have access to the trusted only map
const { SlashCommandBuilder } = require("discord.js");
const { cartesKey } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listusers')
        .setDescription('Admin command to to show a list of users who have access to the urbex map'),
    async execute(interaction) {
        // Checks if user has perms to run command
        if (interaction.user.id != 191775949904150529 && interaction.user.id != 468227744531218444) {
            return await interaction.reply('Permission denied!')
        }

        // Set options and headers for request to API
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${cartesKey}`,
            }
        }

        // Send request to add user to the map
        const userListResponse = await fetch(`https://cartes.io/api/maps/510d3e5c-ab60-4866-90b9-5a1ea1188d71/users/`, options)
            .catch(err => console.error(err))
        
        
        const userListInfo = await userListResponse.json()

        // Go through json and list all usernames in a var
        var usernames = ''
        userListInfo.forEach(entry => {
            usernames = usernames + `${entry.username}, `
        })

        // Show usernames to user
        await interaction.reply(`People who have access to map: ${usernames}`)
    }
}