// Command that tells the user about the bot

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Provides information about the bot'),
    async execute(interaction) {


        // Create about embed
        const aboutEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Aus Urbex Bot Information')
            .setFooter({ text: 'Made and hosted by 69ShadesOfPeanut' })
            .addFields(
                {
                    name: 'About',
                    value: 'The Aus Urbex Bot was made by Peanut to be used alongside the Aus Urbex discord server which is ran by Peanut and Remy',
                    inline: true
                },
                {
                    name: 'Donate',
                    value: '[Peanut](https://ko-fi.com/shadesofpeanut)',
                    inline: true
                },
                {
                    name: 'Github',
                    value: '[Click here for github repo](https://github.com/69ShadesOfPeanut/AusURBEX/)',
                    inline: true
                }
            )
        
        // Send embed
        await interaction.reply({ embeds: [aboutEmbed] })
    }
}