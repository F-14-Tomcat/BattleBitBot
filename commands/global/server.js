const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Shows statistics about BattleBit servers')
        .addStringOption(option => option
            .setName('region')
            .setDescription('(OPTIONAL) The region you want to search')
            .addChoices(
                { name: 'America', value: 'America_Central' },
                { name: 'Europe', value: 'Europe_Central' },
                { name: 'Australia', value: 'Australia_Central' },
                { name: 'Brazil', value: 'Brazil_Central' },
                { name: 'Japan', value: 'Japan_Central' },
                { name: 'Developer', value: 'Developer_Server' },
            )
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('map')
            .setDescription('(OPTIONAL) The map you want to search')
            .addChoices(
                { name: 'Salhan', value: 'Salhan' },
                { name: 'Azagor', value: 'Azagor' },
                { name: 'District', value: 'District' },
                { name: 'SandySunset', value: 'SandySunset' },
                { name: 'WineParadise', value: 'WineParadise' },
                { name: 'Basra', value: 'Basra' },
                { name: 'Valley', value: 'Valley' },
                { name: 'Namak', value: 'Namak' },
                { name: 'Frugis', value: 'Frugis' },
                { name: 'MultuIslands', value: 'MultuIslands' },
                { name: 'Eduardovo', value: 'Eduardovo' },
                { name: 'Lonovo', value: 'Lonovo' },
                { name: 'TensaTown', value: 'TensaTown' },
                { name: 'River', value: 'River' },
                { name: 'Wakistan', value: 'Wakistan' },
                { name: 'Isle', value: 'Isle' },
                { name: 'Construction', value: 'Construction' },
                { name: 'OilDunes', value: 'OilDunes' },
                { name: 'VoxelLand', value: 'VoxelLand' }
            )
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('gamemode')
            .setDescription('(OPTIONAL) The gamemode you want to search')
            .addChoices(
                { name: 'Conquest', value: 'CONQ' },
                { name: 'Domination', value: 'DOMI' },
                { name: 'Frontline', value: 'FRONTLINE' },
                { name: 'Rush', value: 'RUSH'},
                { name: 'Team Death Match', value: 'TDM' },
                { name: 'Elimination', value: 'ELI' },
                { name: 'Voxel', value: 'VoxelFortify' },
            )
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('maxplayers')
            .setDescription('(OPTIONAL) The server size you want to search')
            .addChoices(
                { name: '127v127', value: '254' },
                { name: '64v64', value: '128' },
                { name: '32v32', value: '64' },
                { name: '16v16', value: '32' },
                { name: 'Other', value: 'Other'},
            )
            .setRequired(false)
        ),
    async execute(interaction) {
        retrieveApiData()
            .then(apiData => {
                if (apiData) {
                    apiData = JSON.parse(apiData.trim());
                    displayPlayerCountInfo(apiData, interaction);
                }
            })
            .catch(error => {
                interaction.reply("error");
                console.error("Error occurred while retrieving API data:", error.message);
            });
        
    },
};

function displayPlayerCountInfo(servers, interaction){
    let description = '';
    
    if(interaction.options.getString('region')){
        description += '\nRegion: ' + interaction.options.getString('region');
        servers = servers.filter(server => server.Region === interaction.options.getString('region'));
    }

    if(interaction.options.getString('map')){
        description += '\nMap: ' + interaction.options.getString('map');
        servers = servers.filter(server => server.Map === interaction.options.getString('map'));
    }

    if(interaction.options.getString('gamemode')){
        description += '\nGamemode: ' + interaction.options.getString('gamemode');
        servers = servers.filter(server => server.Gamemode === interaction.options.getString('gamemode'));
    }
    
    if(interaction.options.getString('maxplayers')){
        if(interaction.options.getString('maxplayers') === 'Other'){
            servers = servers.filter(server => (server.MaxPlayers !== 254 && server.MaxPlayers !== 128 && server.MaxPlayers !== 64 && server.MaxPlayers !== 32));
        }else{
            description += '\nMax Players: ' + interaction.options.getString('maxplayers');
            servers = servers.filter(server => server.MaxPlayers === parseInt(interaction.options.getString('maxplayers')));
        }
    }

    const newEmbed = new EmbedBuilder()
        .setTitle('BattleBit Servers')
        .setColor(0x0099FF)
        .setFooter({ text: `BattleBit Version: ${servers[0].Build}` })
        .setTimestamp()
        .addFields(
            { name: 'Number of Servers', value: servers.length.toString(), inline: true},
            { name: 'Players In Game', value: servers.reduce((n, {Players}) => n + Players, 0).toString(), inline: true},
            { name: 'Players In Queue', value: servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString(), inline: true},
        );

    if(description !== '') {
        newEmbed.setDescription(description);
    }
    
    if(!interaction.options.getString('region')){
        newEmbed.addFields({ name: 'Most Popular Region', value: getPopular(servers, 'Region')})
    }
    
    if(!interaction.options.getString('map')){
        newEmbed.addFields({ name: 'Most Popular Map', value: getPopular(servers, 'Map')})
    }
    
    if(!interaction.options.getString('gamemode')){
        newEmbed.addFields({ name: 'Most Popular Gamemode', value: getPopular(servers, 'Gamemode')})
    }
    
    if(!interaction.options.getString('maxplayers')){
        newEmbed.addFields({ name: 'Most Popular Server Size', value: getPopular(servers, 'MaxPlayers')})
    }
    
    interaction.reply({ embeds: [newEmbed] });
}

function retrieveApiData() {
    const url = "https://publicapi.battlebit.cloud/Servers/GetServerList";
    return fetch(url).then(response => {
        return response.text();
    });
}

function getPopular(servers, property) {
    let list = [];
    for(server of servers){
        let name = server[property];
        let current = list.find(item => item.name == name);
        if(current  !== undefined){
            current.servers++;
            current.players += server.Players;
        }else{
            current = {name: name, servers: 1, players: server.Players};
            list.push(current);
        }
    }
    list.sort(function(a, b){return b.players - a.players});
    let returnString = '';
    for(let i = 0; i < Math.min(3, list.length); i++){
        returnString += `${i + 1}. ${list[i].name}: ${list[i].players} players on ${list[i].servers} servers\n`;
    }
    return returnString;
};
