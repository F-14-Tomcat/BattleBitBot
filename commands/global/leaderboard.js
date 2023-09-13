const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows statistics about the top BattleBit players')
        .addStringOption(option => option
            .setName('show')
            .setDescription('The statistic you want to search for')
            .addChoices(
                { name: 'Top Clans', value: 'Top Clans' },
                { name: 'Most XP', value: 'Most XP' },
                { name: 'Most Heals', value: 'Most Heals' },
                { name: 'Most Revives', value: 'Most Revives' },
                { name: 'Most Vehicles Destroyed', value: 'Most Vehicles Destroyed' },
                { name: 'Most Vehicle Repairs', value: 'Most Vehicle Repairs' },
                { name: 'Most Road Kills', value: 'Most Roadkills' },
                { name: 'Longest Kill', value: 'Most Longest Kill' },
                { name: 'Most Objectvies Complete', value: 'Most Objectives Complete' },
                { name: 'Most Kills', value: 'Most Kills' },
            )
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('OPTIONAl')
            .setMaxValue(10)
            .setMinValue(1)
            .setRequired(false)
        ),

    async execute(interaction) {
        //interaction.deferReply({ ephemeral: true });
        let leaderboard = await retrieveLeaderboardData();
        let amount = 3;
        if(interaction.options.getString('show')){
            stat = interaction.options.getString('show');
            leaderboard = leaderboard.find(name => name.hasOwnProperty(stat.split(' ').join('')))[stat.split(' ').join('')];
        }

        if(interaction.options.getInteger('amount')){
            amount = interaction.options.getInteger('amount');
        }

        const newEmbed = new EmbedBuilder()
            .setTitle(`BattleBit Leaderboard`)
            .setColor(0x0099FF)
            .addFields(
                { name: `${stat}:`, value: makeList(leaderboard, amount)},
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

function makeList(list, amount) {
    let returnString = '';
    for(let i = 0; i < Math.min(amount, list.length); i++){
        stats = stat.split(' ');
        stats.shift();
        returnString += `${i + 1}. ${list[i].hasOwnProperty("Clan") ? (`[${list[i].Tag}] ${list[i].Clan}`) : list[i].Name} (${list[[i]].hasOwnProperty("Clan") ? (`${list[i].XP} XP`) : `${list[i].Value} ${stats.join(' ')}`})\n`;
    }
    return returnString;
}
