async function start(client) {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
  
    const channel = client.channels.cache.get(client.config.channelstart);
  
    const embed = new client.discord.EmbedBuilder()
      .setTitle('Démarrage API')
      .setDescription(`J'ai démarré le <t:${timestamp}:D> à <t:${timestamp}:T> (<t:${timestamp}:R>)`)
      .setColor(client.config.color)
      .setFooter({text: 'API - Start', iConURL: client.user.avatarURL()})
  
    channel.send({ embeds: [embed] });
}

module.exports = start