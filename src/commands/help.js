const {EmbedBuilder} = require('discord.js');
const CommandData = require('../data/AllCommands.json')

/** @type {import('commandkit').CommandData} */
const data = {
    name: 'help',
    description: 'Contact information',
};

/** @param {import('commandkit').SlashCommandProps} param0 */
// основная часть
async function run({interaction}){
    let cmnd = CommandData
    let basicStr = '';
    let adminStr = '';
    let musicStr = '';

    for (let i = 0; i < cmnd.length; i++) {
        const string = `> \`${i+1}.\` </${cmnd[i].name + ':' + cmnd[i].id}>\n`
        strn = (`[${i + 1}] ` + cmnd[i].name + ' : ' + cmnd[i].id)
        console.log(strn)
        if (cmnd[i].description === 'basic') {
            basicStr += string;
        } else if (cmnd[i].description === 'admin') {
            adminStr += string;
        } else {
            musicStr += string;
        }
    };
    console.log(basicStr);
    console.log(adminStr);
    console.log(musicStr);
    const HelpEmbed = new EmbedBuilder()
    .setTitle('Contact to solve any problem with bot')
    .addFields(
       {name: 'basic',  value: basicStr},
       {name: 'admin', value: adminStr},
       {name: 'music', value: musicStr}
    )
    .setURL('https://t.me/sinaeeosko')
    .setColor(2895667);

    interaction.reply({embeds: [HelpEmbed], ephemeral: true });
};

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: false,
};
module.exports = { data, run, options}