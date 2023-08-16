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
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `America: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Players | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Players in Queue | ${servers.length.toString()} Servers`});
            break;
        case 1:
            servers = servers.filter(server => server.Region == 'Europe_Central');
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `Europe: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Players | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Players in Queue | ${servers.length.toString()} Servers`});
            break;
        case 2:
            servers = servers.filter(server => server.Region == 'Japan_Central');
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `Japan: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Players | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Players in Queue | ${servers.length.toString()} Servers`});
            break;
        case 3:
            servers = servers.filter(server => server.Region == 'Australia_Central');
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `Australia: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Players | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Players in Queue | ${servers.length.toString()} Servers`});
            break;
        case 4:
            servers = servers.filter(server => server.Region == 'Brazil_Central');
            client.user.setActivity({ name: 'Name', type: ActivityType.Custom, state: `Brazil: ${servers.reduce((n, {Players}) => n + Players, 0).toString()} Players | ${servers.reduce((n, {QueuePlayers}) => n + QueuePlayers, 0).toString()} Players in Queue | ${servers.length.toString()} Servers`});
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
            console.error("Error occurred while retrieving API data in ready.js:", error.message);
        });
    });
}
