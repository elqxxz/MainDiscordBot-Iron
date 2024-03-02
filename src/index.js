require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder} = require('discord.js');
const {CommandKit} = require('commandkit');

const client = new Client({ 
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
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


client.on('messageCreate', (message) => {
    if (message.author.bot) return;
});
client.on('interactionCreate', async (interaction) => {
    const LogChannel = client.guilds.cache.get(process.env.GUILD_ID).channels.cache.get(process.env.LOG_CHANNEL);
    const LoggedReply = await interaction.fetchReply();
    var BotReply = null;

    if (LoggedReply.content == ''){
        BotReply = 'Embed';
    } else {
        BotReply = LoggedReply.content;
    }

    const InterLogEmbed = new EmbedBuilder()
     .setTitle('InterLog')
     .addFields(
         {name:'Author', value:`${interaction.user.username}`},
         {name:'Interacted with', value:`${interaction}`},
         {name:'Bot reply', value: `${BotReply}`}
     );

    LogChannel.send({embeds: [InterLogEmbed]});
})

client.login(process.env.TOKEN)