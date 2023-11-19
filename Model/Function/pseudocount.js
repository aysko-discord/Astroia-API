async function pseudonymCount( client, res ) {
    client.db.get(
        'SELECT COUNT(*) AS count FROM oldnames',
        (err, row) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: client.erreur500 });
          } else {
            const pseudonymCount = row.count;
            res.json({ pseudonymCount });
          }
        }
      );
}

module.exports = pseudonymCount