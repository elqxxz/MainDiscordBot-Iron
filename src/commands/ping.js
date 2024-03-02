/** @type {import('commandkit').CommandData} */

const {EmbedBuilder} = require('discord.js');

const data = {
    name: 'ping',
    description: 'check bot ping',
};

/** @param {import('commandkit').SlashCommandProps} param0 */
// основная часть
async function run({interaction, client}){
    const PingEmbed = new EmbedBuilder()
     .setTitle('Ping')
     .setDescription(`${Date.now() - interaction.createdTimestamp}ms`)
     .setColor(2895667);

    interaction.reply({embeds: [PingEmbed], ephemeral: true});
};

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: true,
};
module.exports = { data, run, options}