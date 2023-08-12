const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Displays all servers the bot is currently in'),
    async execute(interaction) {
        let guilds = interaction.client.guilds.cache.map(guild => guild.name);
        interaction.reply(`Currently in ${interaction.client.guilds.cache.size} servers:\n${guilds.join('\n')}`);
    },
};
