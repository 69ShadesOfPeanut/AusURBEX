// Command for insulting users.
// Can take in user option to target someone else

const { SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insult')
        .setDescription('Insults a user')
        .addUserOption(Option =>
            Option.setName('victim')
                .setDescription('Who do you want to target?')
                .setRequired(false)),
    async execute(interaction) {
        const insultResponse = await request(`https://evilinsult.com/generate_insult.php?lang=en&type=json`)
        const insult = await insultResponse.body.json()

        const victim = interaction.options.getUser('victim')

        if (!victim) {
            await interaction.reply(insult.insult)
        } else {
            await interaction.reply(`${victim}, ${insult.insult}`)
        }
    }
}