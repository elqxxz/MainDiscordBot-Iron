const { YouTubeExtractor} = require("@discord-player/extractor");
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

player.extractors.register(YouTubeExtractor);

const { EmbedBuilder } = require('@discordjs/builders');

/** @type {import('commandkit').CommandData} */
const data = {
    name: 'queue',
    description: 'Shows the first 10 songs in the queue.',
}

/** @param {import('commandkit').SlashCommandProps} param0 */
async function run({interaction, client}) {
    player.extractors.loadDefault()
    const queue = player.nodes.get(interaction.guild);

    if (!queue || !queue.isPlaying) {
        await interaction.reply("there is no song playing.");
        return;
    }

    const queueString = queue.tracks.map((song, i) =>{
        const User = client.guilds.cache.get(process.env.GUILD_ID).members.cache.get(song.requestedBy.id).user
        return `${i + 1})` + `\`[${song.duration}]\` ${song.title} - ${User}`;
    }).join('\n');

    const currentSong = queue.currentTrack;
    console.log(queue.currentTrack);
    const User = client.guilds.cache.get(process.env.GUILD_ID).members.cache.get(currentSong.requestedBy.id).user
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setDescription(`**Currently Playing**\n` + 
                (currentSong ? ` \`[${currentSong.duration}]\` ${currentSong.title} - ${User}` : "None") +
                `\n\n**Queue**\n${queueString}`)
                .setThumbnail(currentSong.thumbnail)
        ]
    })
}

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: false,
};

module.exports = { data, run, options}