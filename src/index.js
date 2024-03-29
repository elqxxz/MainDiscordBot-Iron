require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder} = require('discord.js');
const {Player} = require('discord-player')
const {CommandKit} = require('commandkit');

const OptionsData = require('../src/data/GraberOptions.json');

const client = new Client({ 
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ] 
});

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`,
    devGuildIds: [process.env.GUILD_ID],
    devRoleIds: [process.env.MOD_ROLE_ID],
    bulkRegister: true,
});

client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        filter: (form) => {
            if (form.bitrate && guildMember.voice.channel?.bitrate) return form.bitrate <= guildMember.voice.channel.bitrate;
            return false;
          },
    },
});


client.on('messageCreate', (message) => {
    if (message.author.bot) return;
});
client.on('interactionCreate', async (interaction) => {
    //discord log in channel
    const CommandsThatCanBeLogged = ['ping', 'help']  //there you need to add new commands if you created them:  EXAMPLE --  const CommandsThatCanBeLogged = ['ping', 'help', 'info', 'ban' ] etc

    const LogChannel = client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL);
    if (CommandsThatCanBeLogged.includes(interaction.commandName)) {

        const InterLogEmbed = new EmbedBuilder()
         .setTitle('Interaction Log')
         .addFields(
            {name: 'Where command used', value: `${interaction.guild.name} - ${interaction.channel.name}: ${interaction.channel}`},
            {name: 'Author', value: `${interaction.user.displayName}: ${interaction.user}`},
            {name:'Interacted with', value:`/${interaction.commandName}`},
         )
         .setThumbnail(interaction.guild.iconURL());
        LogChannel.send({embeds: [InterLogEmbed]});
    }

    //Get-avatar autocomplete
    if (!interaction.isAutocomplete()) return;

    const focusedValue = interaction.options.getFocused();

    const filteredChoices = OptionsData.filter((option) => 
        option.name.toLowerCase().startsWith(focusedValue.toLowerCase())
    )
    const results = filteredChoices.map((choice) => {
        return{
            name: `${choice.name}`,
            value: `${choice.id}`,
        }
    });
    interaction.respond(results.slice(0, 2)).catch(() => {});
})
client.on('ready', ()=> {
    console.log(`WAIT UNTIL SECOND SIGN BEFORE USING BOT`);
})
client.on('error', error => {
    console.error('The WebSocket encountered an error:', error);
});

client.login(process.env.TOKEN)