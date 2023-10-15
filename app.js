const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { Client, ActivityType } = require('discord.js');
const Discord = require('discord.js');
const config = require('./config');
const app = express();
let erreur_500 = 'Serveur erreur'
const PORT = config.port;
const DATABASE = 'astroia.db';
const axios = require('axios')
const client = new Client({ intents: [32767] });
const db = new sqlite3.Database(DATABASE);

db.run(
  'CREATE TABLE IF NOT EXISTS oldnames (user_id TEXT, old_name TEXT, timestamp TEXT)',
  function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Table "oldnames" créée avec succès');
    }
  }
);

app.use(express.json());

app.post('/oldnames', (req, res) => {
  const { user_id, old_name } = req.body;
  const timestamp = Math.floor(new Date().getTime() / 1000);

  db.run(
    'INSERT INTO oldnames (user_id, old_name, timestamp) VALUES (?, ?, ?)',
    [user_id, old_name, timestamp],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "erreur_500" });
      } else {
        res.json({ message: 'Oldname save' });
        console.log('[Prevname] Pseudo de ' + user_id + " Pseudo : " + old_name)
      }
    }
  );
  const now = new Date();
  const timestamps = Math.floor(now.getTime() / 1000);
  const channel = client.channels.cache.get(config.channelprevname);
  const embed = new Discord.EmbedBuilder()
    .setTitle('Prevname Save')
    .setDescription(`**User :** <@${user_id}> ([\`${user_id}\`](https://discord.com/users/${user_id}))\n**Prevname :** \`${old_name}\`\n**Times Tamps :** <t:${timestamps}:R>`)
    .setFooter({ text: 'API - Prevnames Logs' })
    .setColor('#2f3136')

  channel.send({ embeds: [embed] });
});

app.post('/clearprevname', (req, res) => {
  const { user_id } = req.body;

  db.run(
    'DELETE FROM oldnames WHERE user_id = ?',
    [user_id],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: erreur_500 });
      } else {
        const numDeleted = this.changes;
        res.json({ message: 'Prevname supprimés', numDeleted: numDeleted });
        console.log('[Prevname] Prevname de ' + user_id + ' (' + numDeleted + ' pseudo supprimés');
      }
    }
  );
});



app.get('/prevnamecount', (req, res) => {
  db.get(
    'SELECT COUNT(*) AS count FROM oldnames',
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: erreur_500 });
      } else {
        const prevnamecount = row.count;
        res.json({ prevnamecount });
      }
    }
  );
});

app.get('/prevnames/:user_id', (req, res) => {
  const { user_id } = req.params;

  db.all(
    'SELECT old_name, timestamp FROM oldnames WHERE user_id = ?',
    [user_id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: erreur_500 });
      } else {
        const pseudonyms = rows.map(row => ({
          old_name: row.old_name,
          timestamp: row.timestamp
        }));
        res.json({ pseudonyms });
      }
    }
  );
});


app.get('/status', async (req, res) => {
  const response = await axios.get(`http://${config.panel}/ping`);
  res.json({ status: 'connected' });
});

app.listen(PORT, () => {
  console.clear()
  console.log(`API lancée sur le port ${PORT}`);
});

const removeDuplicates = () => {
  db.run(
    `
    DELETE FROM oldnames WHERE rowid NOT IN (
      SELECT MIN(rowid) FROM oldnames GROUP BY user_id, old_name)
    `,
    function (err) {
      if (err) {
        console.error(err);
      } else {
        const numDeleted = this.changes;
        console.log('Duplicate supprimé : ' + numDeleted.toLocaleString())
      }
    }
  );
};




client.on('ready', () => {
  console.log(`Astroia - API connecté sur ${client.user.tag}`);
  setInterval(removeDuplicates, 5 * 1000);

  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);

  const channel = client.channels.cache.get(config.channelstart);

  const embed = new Discord.EmbedBuilder()
    .setTitle('Démarrage API')
    .setDescription(`J'ai démarré <t:${timestamp}:R>`)
    .setColor('#2f3136')

  channel.send({ embeds: [embed] });

  client.user.setPresence({ activities: [{ name: "API - Astroia", type: ActivityType.Streaming, url: "https://twitch.tv/oni145" }] })

});

client.login(config.token);


function parseTime(timeString) {
  const regex = /(\d+)([smhdwy])/;
  const match = timeString.match(regex);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    case 'w':
      return value * 7 * 24 * 60 * 60 * 1000;
    case 'y':
      return value * 365 * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}