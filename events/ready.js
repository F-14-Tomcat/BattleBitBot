const { Events, ActivityType } = require('discord.js');
let index = 0;

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        setInterval(updateActivity, 5000, client);
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};

async function updateActivity(client) {
    let servers = await retrieveServerData();
    switch(index % 5){
        case 0:
            servers = servers.filter(server => server.Region == 'America_Central');
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `America: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Player${servers.length == 1 ? '' : 's'} | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Player${servers.length == 1 ? '' : 's'} in Queue | ${servers.length.toString()} Server${servers.length == 1 ? '' : 's'}`});
            break;
        case 1:
            servers = servers.filter(server => server.Region == 'Europe_Central');
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `Europe: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Player${servers.length == 1 ? '' : 's'} | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Player${servers.length == 1 ? '' : 's'} in Queue | ${servers.length.toString()} Server${servers.length == 1 ? '' : 's'}`});
            break;
        case 2:
            servers = servers.filter(server => server.Region == 'Japan_Central');
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `Japan: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Player${servers.length == 1 ? '' : 's'} | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Player${servers.length == 1 ? '' : 's'} in Queue | ${servers.length.toString()} Server${servers.length == 1 ? '' : 's'}`});
            break;
        case 3:
            servers = servers.filter(server => server.Region == 'Australia_Central');
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `Australia: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Player${servers.length == 1 ? '' : 's'} | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Player${servers.length == 1 ? '' : 's'} in Queue | ${servers.length.toString()} Server${servers.length == 1 ? '' : 's'}`});
            break;
        case 4:
            servers = servers.filter(server => server.Region == 'Brazil_Central');
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `Brazil: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Player${servers.length == 1 ? '' : 's'} | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Player${servers.length == 1 ? '' : 's'} in Queue | ${servers.length.toString()} Server${servers.length == 1 ? '' : 's'}`});
            break;
    }
    index++;
}

function retrieveServerData() {
    const url = "https://publicapi.battlebit.cloud/Servers/GetServerList";
    return fetch(url).then(response => {
        return response.text().then(servers => {
            if (servers) {
                return JSON.parse(servers.trim());
            }
        })
        .catch(error => {
            interaction.reply("error");
            console.error("Error occurred while retrieving API data:", error.message);
        });
    });
}

function getMostPopular(servers, property) {
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
    return list[0].name;
};
