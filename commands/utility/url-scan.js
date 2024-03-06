// Command to scan for malware using virustotal

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { virusTotalKey } = require('../../config.json')
const { request } = require("undici")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('url-scan')
        .setDescription('scan url for malware using virustotal')
        .addStringOption(Option =>
            Option.setName('url')
                .setDescription('url to be scanned')
                .setRequired(true)),
    async execute(interaction) {
        // post api request for url to get scanned
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'x-apikey': virusTotalKey,
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ url: interaction.options.getString('url') })
        }

        const postResponse = await fetch('https://www.virustotal.com/api/v3/urls', options)
            .catch(err => console.error(err))
        
        const responseInfo = await postResponse.json()
        

        // Split the id into the part that matters
        var analysisId = responseInfo.data.id.split('-')
        analysisId = analysisId[1]
        


        // Get virus scan results
        const getOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-apikey': virusTotalKey,
                'content-type': 'application/x-www-form-urlencoded'
            }
        }

        const getResponse = await fetch(`https://www.virustotal.com/api/v3/urls/${analysisId}`, getOptions)
            .catch(err => console.error(err))
        
        const getResponseInfo = await getResponse.json()

        //console.log(getResponseInfo)


        // Get IP of domain
        const domainIpResult = await request(`http://ip-api.com/json/${interaction.options.getString('url')}`)
        const DomainIp = await domainIpResult.body.json()

        
        // Create vars for url stats
        const analysisStats = getResponseInfo.data.attributes.last_analysis_stats
        const categories = getResponseInfo.data.attributes.categories
        const reputation = getResponseInfo.data.attributes.reputation
        let trackers = getResponseInfo.data.attributes.trackers

        if (trackers == null) {
            trackers = 'null'
        }

        //console.log(getResponseInfo.data.attributes.redirection_chain)

        // Create embed
        const malwareEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`URL Scan results for ${interaction.options.getString('url')}`)
            .addFields(
                {
                    name: 'Analysis Stats',
                    value:
                    `Malicious: ${analysisStats.malicious}
                    Suspicious: ${analysisStats.suspicious}
                    Undetected: ${analysisStats.undetected}
                    Harmless: ${analysisStats.harmless}`,
                    inline: true
                },
                {
                    name: 'Categories',
                    value: Object.entries(categories).map(([key, value]) => `${key}: ${value}`).join(`\n`),
                    inline: true
                },
                {
                    name: 'Reputation',
                    value: `${reputation}`,
                    inline: true
                },
                {
                    name: 'Trackers',
                    value: Object.keys(trackers).join(`\n`),
                    inline: true
                },
                {
                    name: 'Domain IP',
                    value: `${DomainIp.query}`,
                    inline: true
                },
                {
                    name: 'Location',
                    value: `${DomainIp.city}, ${DomainIp.regionName}, ${DomainIp.country}`,
                    inline: true
                }
            )
        
        // send embed
        await interaction.reply({ embeds: [malwareEmbed] })
    }
}