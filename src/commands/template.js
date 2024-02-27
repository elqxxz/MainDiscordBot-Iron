const { Client, IntentsBitField} = require('discord.js');

const client = new Client({ 
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ] 
});
/** @type {import('commandkit').CommandData} */

const data = {
    name: 'template',
    description: 'template',
};

/** @param {import('commandkit').SlashCommandProps} param0 */
// основная часть
    async function run(interaction, client){
        interaction.reply('ping');
    };

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: true,
};
module.exports = { data, run, options}

client.login(process.env.TOKEN)