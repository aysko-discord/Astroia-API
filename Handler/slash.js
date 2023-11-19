const fs = require('fs');
const { PermissionsBitField } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
require("colors");

module.exports = {
  async execute(client) {
    const rest = new REST({ version: '10' }).setToken(client.config.token);
    const slashCommands = [];
    let x = 0;
    fs.readdirSync(`${process.cwd()}/Commands/`).forEach(async dir => {
      const files = fs.readdirSync(`${process.cwd()}/Commands/${dir}/`).filter(file => file.endsWith('.js'));

      for (const file of files) {
        const slashCommand = require(`${process.cwd()}/Commands/${dir}/${file}`);
        slashCommands.push({
          name: slashCommand.name,
          description: slashCommand.description,
          type: slashCommand.type,
          options: slashCommand.options ? slashCommand.options : null,
          default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
          default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
        });
        x++;
        if (slashCommand.name) {
          client.slashCommands.set(slashCommand.name, slashCommand)
        } else {
          console.log(`Commande Error: ${slashCommand.name || file.split('.js')[0] || "Pas de nom"}`.brightRed)
        }
      }
    });
    (async () => {
      try {
        
        await rest.put(
          Routes.applicationCommands(client.config.botid),
          { body: slashCommands }
        ).catch((e) => { console.log((e.message).bold.red) });
      } catch (error) {
        console.log(error);
      }
    })();
  }
};
