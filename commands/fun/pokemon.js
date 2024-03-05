// Command for getting information about a pokemon
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokemon')
        .setDescription('Get information about a pokemon')
        .addStringOption(Option =>
            Option.setName('pokemon')
                .setDescription('Which pokemon to get info of')
                .setRequired(true)),
    async execute(interaction) {
        const pokemon = interaction.options.getString('pokemon').toLowerCase()

        // Send api request to get pokemon info. return error if api request fails
        const pokemonResult = await request(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        if (pokemonResult.statusCode == 404) {
            await interaction.reply(`Could not find pokemon: ${pokemon}`)
            return
        }

        const pokemonInfo = await pokemonResult.body.json()

        // Slice moves array
        var pokemonMoves = pokemonInfo.moves.slice(1, 8)

        // Build embed
        const pokemonEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${pokemonInfo.name} #${pokemonInfo.id}`)
            .setThumbnail(pokemonInfo.sprites.front_default)
            .addFields(
                {
                    name: 'Height',
                    value: `${pokemonInfo.height * 10}cm`,
                    inline: true
                },
                {
                    name: 'Weight',
                    value: `${pokemonInfo.weight / 10}kg`,
                    inline: true
                },
                {
                    name: 'Stats',
                    value: pokemonInfo.stats.map(a => `${a.stat.name} [${a.base_stat}]`).join(', '),
                    inline: true
                },
                {
                    name: `Abilities [${pokemonInfo.abilities.length}]`,
                    value: pokemonInfo.abilities.map(a => a.ability.name).join(', '),
                    inline: true
                },
                {
                    name: 'Types',
                    value: pokemonInfo.types.map(a => a.type.name).join(', '),
                    inline: true
                },
                {
                    name: `Moves [${pokemonInfo.moves.length}]`,
                    value: pokemonMoves.map(a => a.move.name).join(', '),
                    inline: true
                }
            )

        // Send embed
        await interaction.reply({ embeds: [pokemonEmbed] })
    }
}