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
const images = getLocalImages();

const generateFakeProperty =  Array.from({ length: 50 }, (_, index)   => ({
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
      bhk_type: `${faker.random.number({ min: 1, max: 4 })}BHK`,
      furnishing_status: faker.random.arrayElement(["Full", "Semi", "Nonfurnished"]),
      parking_number: faker.random.number({ min: 0, max: 2 }).toString(),
      floor_number: faker.random.number({ min: 1, max: 10 }).toString(),
      house_type: "Apartment",
      lift: faker.random.arrayElement(["Yes", "No"]),
      parking_number: faker.random.number({ min: 0, max: 2 }).toString(),
      parking_type: faker.random.arrayElement(["Car", "Bike", "None"]),
      property_age: faker.random.arrayElement(["1-5", "5-10", "10+"]),
      property_size: faker.random.number({ min: 500, max: 2000 }).toString(),
      total_floor: faker.random.number({ min: 5, max: 30 }).toString(),
      washroom_numbers: faker.random.number({ min: 1, max: 3 }).toString()
    },
    property_id: faker.random.uuid(),
    property_type: "Residential",
    property_for: index % 3 === 0 ? "Rent" : "Sell",
    reminders: [],
    rent_details: {
      available_from: new Date(Date.now() + faker.random.number({ min: 7, max: 365 }) * 86400000).toDateString(),
      expected_deposit: faker.random.number({ min: 50000, max: 500000 }).toString(),
      expected_rent: faker.random.number({ min: 10000, max: 100000 }).toString(),
      non_veg_allowed: faker.random.arrayElement(["Yes", "No"]),
      preferred_tenants: faker.random.arrayElement(["Family", "Bachelor", "Anyone"])
    },
    sell_details: {
      expected_sell_price: faker.random.number({ min: 5000000, max: 50000000 }).toString(),
      maintenance_charge: faker.random.number({ min: 1000, max: 10000 }).toString(),
      available_from: faker.date.future().toISOString().split('T')[0],
      negotiable: faker.random.boolean() ? "yes" : "no"
    },
    update_date_time: new Date()
  
  }));

// const sampleProperties = Array.from({ length: 50 }, generateFakeProperty);

console.log("Generated Sample Properties:", JSON.stringify(generateFakeProperty, null, 2));

Property.insertMany(generateFakeProperty)
  .then(() => {
    console.log("Sample properties inserted successfully");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error inserting sample properties:", error);
    mongoose.connection.close();
  });
