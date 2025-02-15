const mongoose = require('mongoose');
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const Property = require('../models/commercialProperty');

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

const getLocalImages = () => {
  const imageDir = '/Users/vichirajan/Documents/github/realtoproject/images/89/97/7/';
  const pathX = '/89/97/7/';
  try {
    return fs.readdirSync(imageDir).map(file => path.join(pathX, file));
  } catch (err) {
    console.error("Error reading images directory:", err);
    return [];
  }
};
// const images = getLocalImages();

const generateFakeProperty = () => {
  const images = getLocalImages();
  return {
    _id: new mongoose.Types.ObjectId(),
    agent_id: "SFdRexG0iSUcHbIDOQQik",
    create_date_time: new Date(),
    image_urls: images.sort(() => 0.5 - Math.random()).slice(0, 3).map(url => ({ url })),
    location: {
      type: "Point",
      coordinates: [
        72.8 + Math.random() * 0.1,
        19.0 + Math.random() * 0.1
      ]
    },
    owner_details: {
      address: faker.address.streetAddress(),
      mobile1: faker.phone.phoneNumber(),
      mobile2: faker.phone.phoneNumber(),
      name: faker.name.findName()
    },
    property_address: {
      building_name: faker.company.companyName(),
      city: "Mumbai",
      flat_number: faker.random.alphaNumeric(3),
      formatted_address: faker.address.streetAddress(),
      landmark_or_street: faker.address.streetName(),
      main_text: faker.company.catchPhrase(),
      pin: faker.address.zipCode()
    },
    property_details: {
      property_used_for: faker.random.arrayElement(["Shop", "Office", "Showroom", "Restaurant/Cafe", "Warehouse"]),
      building_type: faker.random.arrayElement(["Bussines Park", "Mall", "Standalone", "Shoping Center", "Industrial"]),
      ideal_for: faker.helpers.shuffle(["shop", "Bank", "ATM","Restaurant/Cafe","Pub/Night Club","Office","Showroom","Godown"]).slice(0, 2),
      parking_type: faker.random.arrayElement(["Car", "Bike", "None"]),
      property_age: faker.random.arrayElement(["1-5", "5-10", "10+"]),
      power_backup: faker.random.arrayElement(["Full", "Partial", "None"]),
      property_size: faker.random.number({ min: 500, max: 5000 }).toString()
    },
    property_for: faker.random.arrayElement(["Rent", "Sell"]),
    property_id: faker.random.uuid(),
    property_type: "Commercial",
    reminders: [],
    rent_details: {
      available_from: new Date(Date.now() + faker.random.number({ min: 7, max: 365 }) * 86400000).toDateString(),
      expected_deposit: faker.random.number({ min: 50000, max: 500000 }).toString(),
      expected_rent: faker.random.number({ min: 20000, max: 200000 }).toString()
    },
    sell_details: {
      available_from: new Date(Date.now() + faker.random.number({ min: 7, max: 365 }) * 86400000).toDateString(),
      expected_sell_price: faker.random.number({ min: 5000000, max: 50000000 }).toString(),
      maintenance_charge: faker.random.number({ min: 1000, max: 10000 }).toString(),
      negotiable: faker.random.arrayElement(["Yes", "No"])
    },
    update_date_time: new Date()
  };
};

const sampleProperties = Array.from({ length: 50 }, generateFakeProperty);

console.log("Generated Sample Properties:", JSON.stringify(sampleProperties, null, 2));

Property.insertMany(sampleProperties)
  .then(() => {
    console.log("Sample properties inserted successfully");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error inserting sample properties:", error);
    mongoose.connection.close();
  });
