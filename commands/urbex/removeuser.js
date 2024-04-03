// Admin only command to remove a user from the private map
const { SlashCommandBuilder } = require("discord.js");
const { cartesKey } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeuser')
        .setDescription('Admin command to remove a user from the urbex private map')
        .addStringOption(Option =>
            Option.setName('user')
                .setDescription('The username of who to remove access from the map')
                .setRequired(true)),
    async execute(interaction) {
        // Checks if user has perms to run command
        if (interaction.user.id != 191775949904150529 && interaction.user.id != 468227744531218444) {
            return await interaction.reply('Permission denied!')
        }

        // Get string for username
        const username = interaction.options.getString('user')

        // Set options and headers for request to API
        const options = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${cartesKey}`,
            }
        }

        // Send request to add user to the map
        const removeUserResponse = await fetch(`https://cartes.io/api/maps/510d3e5c-ab60-4866-90b9-5a1ea1188d71/users/${username}`, options)
            .catch(err => console.error(err))
        
        await interaction.reply('User removed!')
    }
}