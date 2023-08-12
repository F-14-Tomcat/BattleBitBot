const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads all commands'),
    async execute(interaction) {
        let output = `Done!\n`;
        const foldersPath = path.join(__dirname, '../../commands');
        const commandFolders = fs.readdirSync(foldersPath);
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                delete require.cache[require.resolve(filePath)];
                const command = require(filePath);
                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in command && 'execute' in command) {
                    try {
                        interaction.client.commands.delete(command.data.name);
                        interaction.client.commands.set(command.data.name, command);
                        output += `Command \`${command.data.name}\` was reloaded!\n`;
                    } catch (error) {
                        console.error(error);
                        output += `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``;
                    }
                } else {
                    output += `The command at ${filePath} is missing a required "data" or "execute" property. `;
                }
            }
        }
        interaction.reply(output);
    },
};
