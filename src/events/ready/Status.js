module.exports = (client) => {
    const {ActivityType} = require('discord.js');
    
    client.user.setActivity({
        name: `in dev`,
        type: ActivityType.Playing,
    });
    client.user.setPresence({
        status: 'idle',
    })
};