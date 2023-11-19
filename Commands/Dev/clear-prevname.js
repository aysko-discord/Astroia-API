module.exports = {
    name: 'clearprevname',
    description: 'Efface les anciens pseudos d\'un utilisateur',
    options: [
      {
        type: 3,
        name: "id",
        description: "ID de l'utilisateur",
        required: true,
      },
    ],
    run: async (client, interaction) => {
        const isDeveloper = client.config.développeurs.includes(interaction.user.id);
    if (!isDeveloper) {
      return interaction.reply({ content: "Tu ne fais pas partie des développeurs !", ephemeral: true });
    }
      const userId = interaction.options.getString('id');
  
      try {
        const user = await client.users.fetch(userId).catch(() => null);
        if (!user) {
          return interaction.reply({ content: '`❌` Utilisateur invalide !' });
        }
  
        const count = await clearUserPseudonymsFromDatabase(client, userId);
  
        if (count === 0) {
          interaction.reply(`Aucun ancien pseudonyme trouvé pour l'utilisateur \`${user.tag}\`.`);
        } else {
          interaction.reply(`Tous les anciens prevnames de l'utilisateur \`${user.tag}\` ont été effacés avec succès. (${count} prevnames supprimés)`);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression des anciens prevnames :', error);
        interaction.reply('Une erreur s\'est produite.');
      }
    },
  };
  
  async function clearUserPseudonymsFromDatabase(client, userId) {
    return new Promise((resolve, reject) => {
      client.db.run('DELETE FROM oldnames WHERE user_id = ?', [userId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes); 
        }
      });
    });
  }
  