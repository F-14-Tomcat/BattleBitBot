const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { createCanvas, loadImage } = require('canvas');

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
        //interaction.deferReply({ ephemeral: true });
        let servers = await retrieveServerData();
        let description = '';
        let region = '';
        let map = '';
        let gamemode = '';
        let maxplayers = '';

        if(interaction.options.getString('region')){
            region = interaction.options.getString('region');
            description += '\nRegion: ' + interaction.options.getString('region');
            servers = servers.filter(server => server.Region === interaction.options.getString('region'));
        }

        if(interaction.options.getString('map')){
            map = interaction.options.getString('map')
            description += '\nMap: ' + interaction.options.getString('map');
            servers = servers.filter(server => server.Map === interaction.options.getString('map'));
        }

        if(interaction.options.getString('gamemode')){
            gamemode = interaction.options.getString('gamemode');
            description += '\nGamemode: ' + interaction.options.getString('gamemode');
            servers = servers.filter(server => server.Gamemode === interaction.options.getString('gamemode'));
        }

        if(interaction.options.getString('maxplayers')){
            maxplayers = interaction.options.getString('maxplayers');
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
            .addFields(
                { name: 'Number of Servers', value: servers.length.toString(), inline: true},
                { name: 'Players In Game', value: servers.reduce((n, {Players}) => n + Players, 0).toString(), inline: true},
                { name: 'Players In Queue', value: servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString(), inline: true},
            );

        if(description !== '') {
            newEmbed.setDescription(description);
        }

        if(servers.length > 0){
            newEmbed.setFooter({ text: `BattleBit Version: ${servers[0].Build}` })
        }

        if(servers.length > 0 && !interaction.options.getString('region')){
            newEmbed.addFields({ name: 'Most Popular Region', value: makeList(getPopular(servers, 'Region')), inline: true})
            region = getPopular(servers, 'Region')[0].name;
        }

        if(servers.length > 0 && !interaction.options.getString('map')){
            newEmbed.addFields({ name: 'Most Popular Map', value: makeList(getPopular(servers, 'Map')), inline: true})
            map = getPopular(servers, 'Map')[0].name;
        }

        if(servers.length > 0 && !interaction.options.getString('gamemode')){
            newEmbed.addFields({ name: 'Most Popular Gamemode', value: makeList(getPopular(servers, 'Gamemode')), inline: true})
            gamemode = getPopular(servers, 'Gamemode')[0].name;
        }

        if(servers.length > 0 && !interaction.options.getString('maxplayers')){
            newEmbed.addFields({ name: 'Most Popular Server Size', value: makeList(getPopular(servers, 'MaxPlayers')), inline: true})
            maxplayers = getPopular(servers, 'MaxPlayers')[0].name;
        }

        newEmbed.addFields({ name: '\u200b', value: 'Click [HERE](https://discord.com/api/oauth2/authorize?client_id=1139370092547809372&permissions=0&scope=applications.commands%20bot) to add the bot to your server.'});
        const file = new AttachmentBuilder(await generateImage(region, map, gamemode, maxplayers), { name: 'image.png' });
        newEmbed.setThumbnail('attachment://image.png');
        if(interaction.deferred){
            return interaction.editReply({ embeds: [newEmbed], files: [file] });
        }
        return interaction.reply({ embeds: [newEmbed], files: [file] });
    },
};

function retrieveServerData() {
    const url = "https://publicapi.battlebit.cloud/Servers/GetServerList";
    return fetch(url).then(response => {
        return response.text().then(servers => {
            if (servers) {
                return JSON.parse(servers.trim());
            }
        })
        .catch(error => {
            interaction.editReply("error", { ephemeral: true });
            console.error("Error occurred while retrieving API data:", error.message);
        });
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
    return list.sort(function(a, b){return b.players - a.players});
};

function makeList(list) {
    let returnString = '';
    for(let i = 0; i < Math.min(3, list.length); i++){
        returnString += `${i + 1}. ${list[i].name}: ${list[i].players} players on ${list[i].servers} servers\n`;
    }
    return returnString;
}

async function generateImage(region, map, gamemode, maxplayers) {
    const imageHeight = 256;
    const canvas = createCanvas(imageHeight, imageHeight);
    const ctx = canvas.getContext('2d');
    switch(gamemode){
        case 'CONQ':
            gamemode = 'CONQUEST';
            break;
        case 'DOMI':
            gamemode = 'DOMINATION';
            break;
        case 'ELI':
            gamemode = 'ELIMINATION';
            break;
    }
    switch(maxplayers.toString()){
        case '254':
            maxplayers = '127v127';
            break;
        case '128':
            maxplayers = '64v64';
            break;
        case '64':
            maxplayers = '32v32';
            break;
        case '32':
            maxplayers = '16v16';
            break;
        default:
            maxplayers = '';
            break;
    }
    await loadImage(`./maps/${map}.png`).then((image) => {
        canvas.width = imageHeight * (image.width / image.height);
        canvas.height = imageHeight;
        ctx.drawImage(image, 0, 0, imageHeight * (image.width / image.height), imageHeight);
    });
    await loadImage(`./flags/${region}.png`).then((image) => {
        ctx.drawImage(image, 10, 10, (image.width / image.height) * (canvas.width/10) + 10, (canvas.width/10) + 10);
    });
    ctx.font = `${Math.ceil(imageHeight/8)}px Impact`
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.ceil(imageHeight/128);
    ctx.strokeText(gamemode, (canvas.width / 2), 10 + Math.ceil(imageHeight/8));
    ctx.strokeText(maxplayers, (canvas.width / 2), 2 * (10 + Math.ceil(imageHeight/8)));
    ctx.fillStyle = 'white';
    ctx.fillText(gamemode, (canvas.width / 2), 10 + Math.ceil(imageHeight/8));
    ctx.fillText(maxplayers, (canvas.width / 2), 2 * (10 + Math.ceil(imageHeight/8)));
    return canvas.createPNGStream();
}
