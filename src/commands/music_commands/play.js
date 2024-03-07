const {EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const {QueryType} = require('discord-player');
const { YouTubeExtractor} = require("@discord-player/extractor");
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

player.extractors.register(YouTubeExtractor);

/** @type {import('commandkit').CommandData} */
const data = new SlashCommandBuilder()
.setName('play')
.setDescription('plays a song')
.addSubcommand(subcommand => 
    subcommand
      .setName('search')
      .setDescription('searches for a song')
      .addStringOption(option => 
         option
          .setName('searchterms')
          .setDescription('search keywords')
          .setRequired(true)
      )
)
.addSubcommand(subcommand => 
    subcommand
      .setName('playlist')
      .setDescription('Plays playlist from YT')
      .addStringOption(option => 
         option
          .setName('url')
          .setDescription('playlist url')
          .setRequired(true)
      )
)
.addSubcommand(subcommand => 
    subcommand
      .setName('song')
      .setDescription('plays song from YT')
      .addStringOption(option => 
         option
          .setName('url')
          .setDescription('song url')
          .setRequired(true)
      )
);

/** @param {import('commandkit').SlashCommandProps} param0 */
async function run ({interaction, client}){
    player.extractors.loadDefault()
    if (!interaction.member.voice.channel) {
        interaction.reply({content: 'You must be in a voice channel!', ephemeral: true})
        return;
    };

    const queue = player.nodes.create(interaction.guild);

    if (!queue.connection) await queue.connect(interaction.member.voice.channel)

    if (interaction.options.getSubcommand() === 'song') {
        let url = interaction.options.getString('url');

        const result = await player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_VIDEO
        })

        if (result.tracks.length === 0) {
            await interaction.reply({content: 'no results found!', ephemeral: true})
            return;
        }

        const song = result.tracks[0]
        console.log(result.tracks)
        queue.play(song)
        console.log(queue.tracks)

        const embed = new EmbedBuilder()
            .setDescription(`added **[${song.title}](${song.url})** to the queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({text: `Duration: ${song.duration}`})
        await interaction.reply({ embeds: [embed] })
    }
    else if (interaction.options.getSubcommand() === 'playlist') {
        let url = interaction.options.getString('url');

        const result = await player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_PLAYLIST,
        })

        if (result.tracks.length === 0) {
            await interaction.reply({content: 'no playlists found!', ephemeral: true})
            return;
        }

        const playlist = result.playlist;
        queue.play(playlist)
        
        const embed = new EmbedBuilder()
            .setDescription(`added **[${playlist.title}](${playlist.url})** to the queue`)
            .setThumbnail(playlist.thumbnail)
            .setFooter({text: `Duration: ${playlist.duration}`})
        await interaction.reply({ embeds: [embed] })
    }
    else if (interaction.options.getSubcommand() === 'search') {
        let url = interaction.options.getString('searchterms');

        const result = await player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        })

        if (result.tracks.length === 0) {
            await interaction.reply({content: 'no results found!', ephemeral: true})
            return;
        }

        const song = result.tracks[0]
        queue.play(song);

        const embed = new EmbedBuilder()
            .setDescription(`added **[${song.title}](${song.url})** to the queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({text: `Duration: ${song.duration}`})
        await interaction.reply({ embeds: [embed] })
    }

    if (!queue.isPlaying) await queue.play();
};

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: false,
};

module.exports = { data, run, options}