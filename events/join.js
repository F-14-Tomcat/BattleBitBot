const { Events, ActivityType } = require('discord.js');
const path = require('node:path');
const { channelId } = require('../config.json');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        const client = guild.client;
        client.channels.fetch(channelId).then(channel => channel.send(`Joined ${guild.name}\nNow in ${client.guilds.cache.size} Discord Servers`));
    },
};
