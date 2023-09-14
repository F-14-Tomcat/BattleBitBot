const { SlashCommandBuilder, ActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Sets the status for the bot globally')
	.addStringOption(option => option
        .setName('message')
		.setDescription('The message you want to add to the status')
		.setRequired(true)
	),
    async execute(interaction) {
	status = interaction.options.getString('message')
	interaction.client.user.setActivity({name: 'Name', type: ActivityType.Custom, state: status})
        interaction.reply({content: `Set status to ${status}`});
    },
};
