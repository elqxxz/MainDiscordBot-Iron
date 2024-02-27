module.exports = (client) => {
    const {ActivityType} = require('discord.js');
    
    client.user.setActivity({
        name: `online`,
        type: ActivityType.Playing,
    });
};