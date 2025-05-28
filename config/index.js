// config/index.js
module.exports = {
  port: process.env.PORT || 7002,
  host: process.env.HOST || '0.0.0.0',
  mongoURI: process.env.MONGO_URI || "mongodb://realto:realto123@207.180.239.115:27017/realtodb",
  otpApi: process.env.OTP_API || 'd19dd3b7-fc3f-11e7-a328-0200cd936042',
  imagePathDev: process.env.IMAGE_PATH_DEV || "/Users/vichirajan/Documents/github/realtoproject/images",
  imagePathProd: process.env.IMAGE_PATH_PROD || "/root/realto/images",
  imagePathUrl: process.env.NODE_ENV === 'production' ? process.env.IMAGE_PATH_PROD : process.env.IMAGE_PATH_DEV,
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:8082'],
  corsMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Add other configurations like JWT secret, email service credentials etc.
};