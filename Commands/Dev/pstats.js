module.exports = {
    name: 'pstats',
    description: 'Affiche combien de membre dans les prevnames',
    run: async (client, interaction) => {
      const isDeveloper = client.config.développeurs.includes(interaction.user.id);
      if (!isDeveloper) {
        return interaction.reply({ content: "Tu ne fais pas partie des développeurs !", ephemeral: true });
      }
  
      client.db.get(
        `SELECT COUNT(*) AS pseudonymCount FROM oldnames`,
        (err, row) => {
          if (err) {
            console.error('Error executing the query:', err);
            return interaction.reply({ content: "Une erreur s'est produite", ephemeral: true });
          }
  
          const pseudonymCount = row.pseudonymCount;
          interaction.reply({ content: `Il y a \`${pseudonymCount}\` membre(s) dans les prevnames.`, ephemeral: true });
        }
      );
    },
  };
  