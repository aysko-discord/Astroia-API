async function clear_prevname(client, user_id, res, req) {
    client.db.run(
        'DELETE FROM oldnames WHERE user_id = ?',
        [user_id],
        function (err) {
          if (err) {
            console.error(err);
            res.status(500).json({ error: client.erreur500 });
          } else {
            const numDeleted = this.changes;
            res.json({ message: 'Prevname supprimés', numDeleted: numDeleted });
            console.log('[Prevname] Prevname de ' + user_id + ' (' + numDeleted + ' pseudo supprimés)');
          }
        }
      );
} 

module.exports = clear_prevname