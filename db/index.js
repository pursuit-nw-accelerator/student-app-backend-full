// get envvars from .env
const pgp = require('pg-promise')();

let databaseUrl = process.env.DB_URL;

const cn = {
  connectionString: databaseUrl,
  allowExitOnIdle: true,
  max: 30,
};

const db = pgp(cn);

module.exports = db;
