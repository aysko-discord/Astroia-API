const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'update',
  description: 'Met à jour la version des clients',
  options: [
    {
      type: 3,
      name: "version",
      description: "La nouvelle version",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const isDeveloper = client.config.développeurs.includes(interaction.user.id);
    if (!isDeveloper) {
      return interaction.reply({ content: "Tu ne fais pas partie des développeurs !", ephemeral: true });
    }

    const newVersion = interaction.options.getString('version');
    const config = require(path.join(__dirname, '../../config.js'));
    config.version = newVersion;
    fs.writeFileSync(path.join(__dirname, '../../config.js'), `module.exports = ${JSON.stringify(config, null, 2)};`);

    interaction.reply({
      content: `La version des bots perso est désormais : \`${newVersion}\``,
      ephemeral: true,
    });
  }
};
