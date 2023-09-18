const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Shows your BattleBit stats')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The player you want to search for')
            .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        let leaderboard = await retrieveLeaderboardData();
        let player = interaction.options.getString('name');
        leaderboard = leaderboard.filter(stat => stat[Object.keys(stat)[0]].some(index => index.Name == player));

        if(leaderboard.length == 0){
            return interaction.editReply({content: `${player} could not be found in the leaderboards. Only the top 5000 players are shown.`, ephemeral: true } );
        }

        const newEmbed = new EmbedBuilder()
            .setTitle(player)
            .setColor(0x0099FF)
            .addFields(
                { name: `Stats:`, value: makeList(leaderboard, player)},
            );

        newEmbed.addFields({ name: '\u200b', value: 'Click [HERE](https://discord.com/api/oauth2/authorize?client_id=1139370092547809372&permissions=0&scope=applications.commands%20bot) to add the bot to your server.'});
        if(interaction.deferred){
            return interaction.editReply({ embeds: [newEmbed]});
        }
        return interaction.reply({ embeds: [newEmbed]});
    },
};

function retrieveLeaderboardData() {
    const url = "https://publicapi.battlebit.cloud/Leaderboard/Get";
    return fetch(url).then(response => {
        return response.text().then(leaderboard => {
            if (leaderboard) {
                return JSON.parse(leaderboard.trim());
            }
        })
        .catch(error => {
            console.error("Error occurred while retrieving API data:", error.message);
        });
    });
}

function makeList(list, player) {
    let returnString = '';
    list.forEach(stat => {
        let tempStat = Object.keys(stat)[0].replace(/([a-z])([A-Z])/g, '$1 $2');
        tempStat = tempStat.split(' ');
        tempStat.shift();
        returnString += `${tempStat.join(' ')}: ${stat[Object.keys(stat)[0]].find(index => index.Name == player).Value} (#${stat[Object.keys(stat)[0]].findIndex(index => index.Name == player) + 1} globally)\n`
    });
    return returnString;
}
