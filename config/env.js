const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Determine the environment
const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = `.env.${NODE_ENV}`;

// Load env file
const envPath = path.resolve(__dirname, '..', envFile);
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`✅ Loaded environment from ${envFile}`);
} else {
  console.warn(`⚠️ Env file ${envFile} not found, falling back to default .env`);
  dotenv.config();
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  IMAGE_PATH_URL: process.env.IMAGE_PATH_URL,
  OTP_API: process.env.OTP_API
};
