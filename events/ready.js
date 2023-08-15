const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        setInterval(updateActivity, 3000, client);
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};

async function updateActivity(client) {
    let servers = await retrieveServerData();
    client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `Players in Game: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} | Players in Queue: ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} | BattleBit Servers: ${servers.length.toString()} | Most Popular Region: ${getMostPopular(servers, 'Region')}`});
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
