async function table(client) {
    client.db.run(
        'CREATE TABLE IF NOT EXISTS oldnames (user_id TEXT, old_name TEXT, timestamp TEXT)',
        function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log('Table "oldnames" créée avec succès');
          }
        }
      );
}

module.exports = table