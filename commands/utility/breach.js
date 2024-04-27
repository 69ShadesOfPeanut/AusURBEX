// Command to check if your email has been breached

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('breach')
        .setDescription('Checks if your email has been involved in a data breach')
        .addStringOption(Option =>
            Option.setName('email')
                .setDescription('email to check for breaches')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()

        // Get string for email
        const email = interaction.options.getString('email')

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
        const response = await fetch(`https://api.xposedornot.com/v1/breach-analytics?email=${email}`, options)
            .catch(err => console.error(err))
        
        const responseInfo = await response.json()

        // Check if email was found
        if (responseInfo.Error == 'Not found' || responseInfo.BreachesSummary.domain == '') {
            await interaction.reply('invalid email address')
            return
        }

        //console.log(responseInfo.Error)

        // Define vars for use
        var passwordsStrength = responseInfo.BreachMetrics.passwords_strength[0]

        // Slice breaches array
        var breaches = responseInfo.ExposedBreaches.breaches_details.slice(0, 50)

        // Build discord embed
        const breachEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Data breaches')
            .addFields(
                {
                    name: 'Breaches',
                    value: breaches.map(a => a.breach).join(', '),
                    inline: true
                },
                {
                    name: 'Passwords strength',
                    value: `
                    Easy to crack: ${passwordsStrength.EasyToCrack}
                    Plain text: ${passwordsStrength.PlainText}
                    Strong hash: ${passwordsStrength.StrongHash}
                    Unknown: ${passwordsStrength.Unknown}
                    `,
                    inline: true
                },
                {
                    name: 'Risk',
                    value: responseInfo.BreachMetrics.risk[0].risk_label,
                    inline: true
                }
            )
        
        // Send embed
        await interaction.editReply({ embeds: [breachEmbed] })
    }
}