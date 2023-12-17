const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { Client, ActivityType } = require('discord.js');
const client = new Client({ intents: [32767] });

const config = require('./config');
const app = express();
const Discord = require('discord.js');
const erreur_500 = 'Serveur erreur : 500'
const PORT = config.port;
const DATABASE = 'database.db';
const db = new sqlite3.Database(DATABASE);

client.db = db
client.discord = Discord
client.config = config
client.erreur500 = erreur_500
client.login(config.token);
client.slashCommands = new Discord.Collection()

// Model 
const table = require('./Model/API/table');
const save_oldname = require('./Model/Function/save');
const prevname = require('./Model/Function/prevname');
const clear_prevname = require('./Model/Function/clear_prevname')
const stats = require('./Model/Manager/stats')
const start = require('./Model/API/start')
const pseudocount = require('./Model/Function/pseudocount')
const versionbot = require('./Model/Bots Perso/version')
app.use(express.json());

app.post('/oldnames', (req, res) => {
  const { user_id, old_name } = req.body;
  const timestamp = Math.floor(new Date().getTime() / 1000);
  save_oldname(client, res, user_id, old_name, timestamp)
});


app.post('/clearprevname', (req, res) => {
  const { user_id } = req.body;
  clear_prevname(client, user_id, res, req)
});

app.post('/api/version', (req, res) => {
  const { version } = req.body;
  versionbot(client, req, res, version)
})

app.get('/manager/stats', (req, res) => {
  stats(client, res)
});



app.get('/pseudonymCount', (req, res) => {
  pseudocount(client, res)
});

app.get('/prevnames/:user_id', (req, res) => {
  const { user_id } = req.params;
  prevname(client, user_id, req, res)
});


app.get('/ping', async (req, res) => {
  res.json({ status: 'connected' });
});

app.listen(PORT, () => {
  table(client);
  console.clear()
});



client.on('ready', () => {
  console.log(`Bot em ligneej tant que ${client.user.tag}`);
  console.log(`Slash Commande : ${client.slashCommands.size}`)
  start(client)
  client.user.setPresence({ activities: [{ name: "API - Helix", type: ActivityType.Streaming, url: "https://twitch.tv/aysko" }] })
});


['slash'].forEach((handler) => {
  const file = require(`./Handler/${handler}`)
  if (file.execute) file.execute(client);
  else file(client);
});


client.on('interactionCreate', async (interaction) => {

  const slashCommand = client.slashCommands.get(interaction.commandName);
  if (!slashCommand) return client.slashCommands.delete(interaction.commandName);
  await slashCommand.run(client, interaction)
  console.log(`La commande ${interaction.commandName} a été utilisée par ${interaction.user.tag} (${interaction.user.id}) dans le discord ${interaction.guild.name}`)
}
)


