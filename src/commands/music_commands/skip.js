const {SpotifyExtractor} = require("@discord-player/extractor");
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

player.extractors.register(SpotifyExtractor);

const { EmbedBuilder} = require('discord.js')

/** @type {import('commandkit').CommandData} */
const data = {
    name: 'skip',
    description: 'Skips the current song',
}

/** @param {import('commandkit').SlashCommandProps} param0 */
async function run({interaction, client}) {
    player.extractors.loadDefault()
    const queue = player.nodes.get(interaction.guild);

    if (!queue) {
        return interaction.reply({
            content: 'There is nothing playing!',
            ephemeral: true,
        });
    }
    
    const currentSong = queue.currentTrack;

    queue.node.skip(currentSong);

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
              .setDescription(`**${currentSong.title}** skipped!`)
              .setThumbnail(currentSong.thumbnail)
        ]
    })
}

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: false,
};

module.exports = { data, run, options}