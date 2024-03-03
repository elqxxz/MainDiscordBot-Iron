module.exports = (client) => {
    client.user.setPresence({
    activities: [{
        name: `in dev`,
    }],
        status: 'idle',
    })
};