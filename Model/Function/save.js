// ...

async function save_oldname(client, res, user_id, old_name, timestamp) {
    const now = new Date();
    const lastMinute = now.getTime() - 60 * 1000; 
    const lastMinuteTimestamp = Math.floor(lastMinute / 1000);
  
    client.db.get(
      'SELECT COUNT(*) as count FROM oldnames WHERE user_id = ? AND old_name = ? AND timestamp > ?',
      [user_id, old_name, lastMinuteTimestamp],
      (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: client.erreur500 });
        } else {
          const count = row.count;
  
          if (count > 0) {
            res.json({ message: 'Prevname non save (duplicate en 1 minute)' });
            console.log('[Prevname] Pseudo de ' + user_id + " Pseudo : " + old_name + " non save (duplicate en 1 minute)");
          } else {
            client.db.run(
              'INSERT INTO oldnames (user_id, old_name, timestamp) VALUES (?, ?, ?)',
              [user_id, old_name, timestamp],
              function (err) {
                if (err) {
                  console.error(err);
                  res.status(500).json({ error: client.erreur500 });
                } else {
                  res.json({ message: 'Prevname save' });
                  console.log('[Prevname] Pseudo de ' + user_id + " Pseudo : " + old_name + " saved");
                  
                  const timestamps = Math.floor(now.getTime() / 1000);
                  const channel = client.channels.cache.get(client.config.channelprevname);
                  
                  client.users.fetch(user_id).then((user) => {
                    const tag = user.tag;
                    const url = `https://discord.com/users/${user_id}`
                    const embed = new client.discord.EmbedBuilder()
                      .setTitle('Prevname Save')
                      .setDescription(`**User :** <@${user_id}> ([\`${tag}\`](${url}) / [\`${user_id}\`](${url}))\n**Prevname :** \`${old_name}\`\n**Times Tamps :** <t:${timestamps}:R>`)
                      .setFooter({ text: 'API - Prevnames Logs', iconURL: client.user.avatarURL() })
                      .setColor(client.config.color);
        
                    channel.send({ embeds: [embed] });
                  }).catch((error) => {
                    console.log('[Erreur]: ' + error);
                  });
                }
              }
            );
          }
        }
      }
    );
  }
  
  module.exports = save_oldname;
  