const faker = require('faker');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Property = require('../models/residentialProperty');

const MONGO_URI = 'mongodb://realto:realto123@207.180.239.115:27017/realtodb'; // Update with your actual MongoDB URI




mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});



// Function to delete entries created today
async function deleteEntriesFromToday() {
  try {
    // Get today's date at midnight (start of the day)
    const today = new Date("2025-02-09");
    // today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    // today.setDate(today.getDate() -2);

    // Get tomorrow's date at midnight (end of the day)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 5);

    // Delete documents created today
    const result = await Property.deleteMany({
      create_date_time: {
        $gte: today, // Greater than or equal to today's start
        $lt: tomorrow, // Less than tomorrow's start
      },
    });

    console.log(`Deleted ${result.deletedCount} entries created today.`);
  } catch (error) {
    console.error('Error deleting entries:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the function
deleteEntriesFromToday();


// Property.insertMany(sampleProperties)
//   .then(() => {
//     console.log("Sample properties inserted successfully");
//     mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.error("Error inserting sample properties:", error);
//     mongoose.connection.close();
//   });
