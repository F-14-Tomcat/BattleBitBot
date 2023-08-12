const { Events, ActivityType } = require('discord.js');
const path = require('node:path');
const { channelId } = require('../config.json');

module.exports = {
    name: Events.GuildCreate,
    execute(guild) {
	const client = guild.client;
	client.user.setActivity(`Battlebit on ${client.guilds.cache.size} Discord Servers`, { type: ActivityType.Playing });
	console.log(`Currently in ${client.guilds.cache.size} servers`);
	client.channels.fetch(channelId).then(channel => channel.send(`Joined ${guild.name}\nNow in ${client.guilds.cache.size} Discord Servers`));
    },
};
