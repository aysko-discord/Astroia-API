async function stats(client, res) {
    client.db.get(
        `SELECT
          (SELECT COUNT(*) FROM oldnames) AS pseudonymCount,
          (SELECT COUNT(*) FROM bots) AS botCount`,
        (err, row) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: client.erreur500 });
          } else {
            const prevname = row.pseudonymCount;
            const uptime = client.uptime
            const bots = row.botCount;
            const version = client.config.versionapi
            res.json({ prevname, bots, uptime, version });
          }
        }
      );
}


module.exports = stats 