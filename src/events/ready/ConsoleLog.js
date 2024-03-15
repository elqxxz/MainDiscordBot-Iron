module.exports = () => {
    const {Client, IntentsBitField} = require('discord.js')
    const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds
        ]
    });
    client.on('ready', () => {
        console.log(`------------------------------------`)
        console.log(`✅ Logged in as ${client.user.tag}!`);
        console.log(`------------------------------------`)
    })
    client.login(process.env.TOKEN)
}