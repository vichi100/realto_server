const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('./models/User'); // Example Mongoose model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb');

cron.schedule('0 0 * * 0', async () => {
  console.log('Running database cleanup...');
  await User.deleteMany({ inactive: true }); // Delete inactive users
  console.log('Cleanup done!');
});
