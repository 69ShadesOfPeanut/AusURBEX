// Command for getting the weather of an area

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Shows you the weather for a region')
        .addStringOption(Option =>
            Option.setName('location')
                .setDescription('Where to check the weather of')
                .setRequired(true)),
    async execute(interaction) {
        const locationOption = interaction.options.getString('location')
        
        // Sends an API request to weatherapi and saves it to a var
        const weatherResponse = await request(`http://api.weatherapi.com/v1/current.json?key=c9b4f011140e467792d105320230903&q=${locationOption}&aqi=no`)
        const { location, current } = await weatherResponse.body.json()

        // Checks if it is day
        var IsDay = true
        if (current.is_day == 0) {
            IsDay = false
        } else {
            IsDay = true
        }

        // Make embed with weather information
        const weatherEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Weather in ${location.name}, ${location.region}, ${location.country}`)
            .setImage(`https:${current.condition.icon}`)
            .addFields(
                {
                    name: 'Last Updated',
                    value: `${current.last_updated}`,
                    inline: true
                },
                {
                    name: 'Temp',
                    value: `${current.temp_c}c`,
                    inline: true
                },
                {
                    name: 'Feels Like',
                    value: `${current.feelslike_c}c`,
                    inline: true
                },
                {
                    name: 'UV',
                    value: `${current.uv}`,
                    inline: true
                },
                {
                    name: 'Time',
                    value: `${location.localtime}`,
                    inline: true
                },
                {
                    name: 'Is Day',
                    value: `${IsDay}`,
                    inline: true
                },
                {
                    name: 'Condition',
                    value: `${current.condition.text}`,
                    inline: true
                },
                {
                    name: 'Wind',
                    value: `${current.wind_kph}KPH`,
                    inline: true
                },
                {
                    name: 'Wind Direction',
                    value: `${current.wind_dir}`,
                    inline: true
                },
                {
                    name: 'Gust',
                    value: `${current.gust_kph}KPH`,
                    inline: true
                },
                {
                    name: 'Humidity',
                    value: `${current.humidity}%`,
                    inline: true
                },
                {
                    name: 'Precipitation',
                    value: `${current.precip_mm}MM`,
                    inline: true
                }
            )

        // Send embed
        await interaction.reply({ embeds: [weatherEmbed] })
    }
}