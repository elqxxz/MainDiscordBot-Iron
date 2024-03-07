const {SpotifyExtractor} = require("@discord-player/extractor");
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

player.extractors.register(SpotifyExtractor);

/** @type {import('commandkit').CommandData} */
const data = {
    name: 'pause',
    description: 'pauses the current song',
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

    queue.node.pause();

    await interaction.reply("The current song has been paused")
}

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: false,
};

module.exports = { data, run, options}