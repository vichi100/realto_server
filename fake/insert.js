const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Customer = require('./Customer'); // Import the schema


const MONGO_URI = 'mongodb://realto:realto123@207.180.239.115:27017/realtodb'; // Update with your actual MongoDB URI
// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Function to generate fake customers
async function insertFakeCustomers(count) {
  let customers = [];

  for (let i = 0; i < count; i++) {
    const fakeCustomer = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      location: [
        {
          type: "Point",
          coordinates: [
            parseFloat(faker.location.longitude()), // Random longitude
            parseFloat(faker.location.latitude())   // Random latitude
          ]
        }, 
        {
            type: "Point",
            coordinates: [
              parseFloat(faker.location.longitude()), // Random longitude
              parseFloat(faker.location.latitude())   // Random latitude
            ]
          }
      ]
    };
    customers.push(fakeCustomer);
  }

  try {
    await Customer.insertMany(customers);
    console.log(`${count} fake customers inserted successfully!`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting fake customers:', error);
  }
}

// Insert 10 fake customers
insertFakeCustomers(10);
