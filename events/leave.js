const { Events, ActivityType } = require('discord.js');
const { channelId } = require('../config.json');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        const client = guild.client;
        client.channels.fetch(channelId).then(channel => channel.send(`Left ${guild.name}\nNow in ${client.guilds.cache.size} Discord Servers`));
    },
};
