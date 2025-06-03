const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

pool.connect()
  .then(client => {
    console.log('Connexion à PostgreSQL réussie');
    client.release();
  })
  .catch(err => {
    console.error('Échec de la connexion à PostgreSQL', err);
    process.exit(1);
  });

module.exports = pool;