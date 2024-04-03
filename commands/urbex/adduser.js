// Admin only command to add a user to the private map
const { SlashCommandBuilder } = require("discord.js");
const { cartesKey } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('Admin command to add a user to the urbex private map')
        .addStringOption(Option =>
            Option.setName('user')
                .setDescription('The username of who to give access to the map')
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
            method: 'POST',
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${cartesKey}`,
            }
        }

        // Send request to add user to the map
        const addUserResponse = await fetch(`https://cartes.io/api/maps/510d3e5c-ab60-4866-90b9-5a1ea1188d71/users?username=${username}`, options)
            .catch(err => console.error(err))

        //console.log(`status: ${addUserResponse?.status}`)

        // Check the status of the request
        if (addUserResponse?.status == 201) {
            await interaction.reply('User added!')
        } else if (addUserResponse?.status == 409) {
            await interaction.reply('User already added!')
        } else {
            await interaction.reply(`Error! Status code: ${addUserResponse?.status}`)
            console.log(`Error with add user command! Status code: ${addUserResponse?.status}`)
        }
    }
}