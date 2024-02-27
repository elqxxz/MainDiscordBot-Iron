require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');
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
})

client.login(process.env.TOKEN)