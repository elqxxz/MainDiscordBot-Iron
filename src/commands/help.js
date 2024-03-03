/** @type {import('commandkit').CommandData} */

const {EmbedBuilder} = require('discord.js');

const data = {
    name: 'help',
    description: 'Contact information',
};

/** @param {import('commandkit').SlashCommandProps} param0 */
// основная часть
async function run({interaction, client}){
    const HelpEmbed = new EmbedBuilder()
     .setTitle('Contact to solve any problem with bot')
     .setURL('https://t.me/sinaeeosko')
     .setColor(2895667);

    interaction.reply({embeds: [HelpEmbed], ephemeral: true});
};

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: false,
};
module.exports = { data, run, options}