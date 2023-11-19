const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'prevname',
    description: 'Affiche vos anciens pseudos',
    usage: '/prevname',
    category: 'Owners',
    userPerms: [],
    botPerms: [],
    cooldown: 0,
    guildOnly: false,
    maintenance: false,
    options: [
        {
            type: 3,
            name: "user",
            description: "ID de l'utilisateur",
            required: false,
        },
    ],
    run: async (client, interaction) => {
        const userId = interaction.options.getString('user') || interaction.user.id;
        const selectQuery = 'SELECT * FROM oldnames WHERE user_id = ?';

        client.db.all(selectQuery, [userId], (err, rows) => {
            if (err) {
                console.error('Erreur lors de la récupération des anciens pseudos :', err);
                interaction.reply('Une erreur s\'est produite.');
                return;
            }
            const pseudonyms = rows.map(row => ({
                old_name: row.old_name,
                timestamp: row.timestamp
            }));

            try {
                const pseudonymCount = pseudonyms.length;

                if (pseudonymCount === 0) {
                    interaction.reply('Aucun pseudo trouvé.');
                } else {
                    client.users.fetch(userId).then((user) => {
                        const tag = user.tag;
                        const url = `https://discord.com/users/${userId}`

                        const embed = new EmbedBuilder()
                            .setColor(client.config.color)
                            .setTitle(`Prevname de ${tag}`)
                            .setDescription(pseudonyms.map((entry, index) => `**${index + 1})** <t:${Math.floor(entry.timestamp)}:R> - [\`${entry.old_name}\`](${url})`).join('\n'))
                            .setFooter({ text: `Total des Prevnames dans L'API : ${pseudonymCount}`, iconURL: interaction.user.avatarURL() });

                        interaction.reply({ embeds: [embed], ephemeral: true });
                    })
                }
            } catch (error) {
                console.error('Erreur lors de la récupération :', error);
                interaction.reply('Une erreur s\'est produite.');
            }
        });
    },
};
