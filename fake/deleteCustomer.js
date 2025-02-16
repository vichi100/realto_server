const mongoose = require('mongoose');
const CommercialPropertyCustomer = require('../models/commercialPropertyCustomer');

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

// Function to delete all entries from CommercialPropertyCustomer collection
async function deleteAllCommercialPropertyCustomers() {
  try {
    // Delete all documents
    const result = await CommercialPropertyCustomer.deleteMany({});
    console.log(`Deleted ${result.deletedCount} entries from CommercialPropertyCustomer collection.`);
  } catch (error) {
    console.error('Error deleting entries:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the function
deleteAllCommercialPropertyCustomers();
