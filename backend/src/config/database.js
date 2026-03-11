// src/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 6543,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
});

// Test connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur connexion base de données:', err.message);
  } else {
    console.log('✅ Base de données PostgreSQL connectée');
    release();
  }
});

module.exports = pool;
