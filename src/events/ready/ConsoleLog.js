module.exports = (client) => {
    client.on('ready', (args) => {
        console.log(`✅ Logged in as ${client.user.tag}!`);
    })
}