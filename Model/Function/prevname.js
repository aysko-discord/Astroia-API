async function prevname(client, user_id, req, res) {
    client.db.all(
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
}

module.exports = prevname