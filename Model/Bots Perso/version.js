async function versionbot(client, req, res, version)
{
    const botVersion = version 
  
    if (client.config.version === botVersion) {
      res.json({ message: `Aucune mise à jour disponible.` });
    } else {
      res.json({ message: `Mise à jour disponible en attente.` });
    }
  }
  
module.exports = versionbot;
  