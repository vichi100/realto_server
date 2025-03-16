const mongoose = require('mongoose');
const faker = require('faker');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
const ResidentialPropertyRent = require('../models/residentialPropertyRent');

const MONGO_URI = 'mongodb://realto:realto123@207.180.239.115:27017/realtodb';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

const agentId = 'MRYAca_yereFwLwYd01xa';

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

const generateRandomCoordinates = (baseCoordinates, radiusInKm) => {
  const radiusInDegrees = radiusInKm / 111; // 1 degree is approximately 111 km
  const randomOffset = () => (Math.random() - 0.5) * 2 * radiusInDegrees;
  return [
    baseCoordinates[0] + randomOffset(),
    baseCoordinates[1] + randomOffset()
  ];
};

const formatDate = (date) => {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const insertDummyData = async () => {
  const baseCoordinates = [72.81703279999999, 19.1246969];
  const properties = [];

  for (let i = 0; i < 1; i++) {
    const property = {
      property_id: nanoid(),
      agent_id: agentId,
      property_type: 'Residential',
      property_for: 'Rent',
      property_status: '1',
      is_close_successfully: 'no',
      owner_details: {
        name: faker.name.findName(),
        mobile1: faker.phone.phoneNumber('##########'),
        mobile2: faker.phone.phoneNumber('##########'),
        address: faker.address.streetAddress()
      },
      location: {
        type: 'Point',
        coordinates: generateRandomCoordinates(baseCoordinates, 10)
      },
      property_address: {
        city: 'Mumbai',
        main_text: faker.address.streetName(),
        formatted_address: faker.address.streetAddress(),
        flat_number: faker.random.number({ min: 1, max: 1000 }).toString(),
        building_name: faker.company.companyName(),
        landmark_or_street: faker.address.streetName(),
      },
      property_details: {
        house_type: 'Apartment',
        bhk_type: '2BHK', //faker.random.arrayElement(['1BHK', '2BHK', '3BHK']),
        washroom_numbers: faker.random.number({ min: 1, max: 3 }).toString(),
        furnishing_status: faker.random.arrayElement(['Full', 'Semi', 'Empty']),
        parking_type: faker.random.arrayElement(['Car', 'Bike']),
        parking_number: faker.random.number({ min: 0, max: 5 }).toString(),
        property_age: faker.random.arrayElement(['1-5', '5-10', '10-15', '20+']),
        floor_number: faker.random.number({ min: 1, max: 20 }).toString(),
        total_floor: faker.random.number({ min: 1, max: 30 }).toString(),
        lift: faker.random.boolean() ? 'Yes' : 'No',
        property_size: faker.random.number({ min: 500, max: 2000 }).toString()
      },
      rent_details: {
        expected_rent: 25000,//faker.random.number({ min: 10000, max: 100000 }).toString(),
        expected_deposit: 250000,//faker.random.number({ min: 50000, max: 500000 }).toString(),
        available_from: formatDate(faker.date.future()),
        preferred_tenants: faker.random.arrayElement(['Family', 'Bachelors', 'Any']),
        non_veg_allowed: faker.random.boolean() ? 'Yes' : 'No'
      },
      image_urls: images.sort(() => 0.5 - Math.random()).slice(0, 3).map(url => ({ url })),
      create_date_time: new Date(),
      update_date_time: new Date()
    };

    properties.push(property);
  }

  try {
    await ResidentialPropertyRent.insertMany(properties);
    console.log("50 dummy properties inserted successfully       "+ JSON.stringify(properties, null, 2) );
  } catch (error) {
    console.error("Error inserting dummy properties:", error);
  } finally {
    mongoose.connection.close();
  }
};

insertDummyData();
