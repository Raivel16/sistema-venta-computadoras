require('dotenv').config();
const mongoose = require('mongoose');

// Configuración de conexión compartida por server.js y seeders/seed.js
async function conectarDB() {
  const { MONGODB_URI, DB_NAME } = process.env;
  if (!MONGODB_URI || !DB_NAME) {
    throw new Error('Faltan las variables MONGODB_URI o DB_NAME (revisa tu archivo .env)');
  }
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
}

module.exports = { conectarDB };
