const { Events, ActivityType } = require('discord.js');
const axios = require('axios');
const { token, version } = require('../config.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        let servers = [];
        retrieveApiData()
            .then(apiData => {
                if (apiData) {
                    servers = JSON.parse(apiData.trim());
                    setActivity(client, servers);
                }
            })
            .catch(error => {
                interaction.reply("error");
                console.error("Error occurred while retrieving API data:", error.message);
            });
    },
};

function retrieveApiData() {
    const url = "https://publicapi.battlebit.cloud/Servers/GetServerList";
    return fetch(url).then(response => {
        return response.text();
    });
}

function setActivity(client, servers) {
    client.user.setActivity('test', { type: 4, state: `BattleBit Servers: ${servers.length.toString()}\tPlayers in Game: ${servers.reduce((n, {Players}) => n + Players, 0).toString()}`});
    console.log(`Ready! Logged in as ${client.user.tag}`);
}
