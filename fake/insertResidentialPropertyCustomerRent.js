const mongoose = require('mongoose');
const faker = require('faker');
const { nanoid } = require('nanoid');
const ResidentialPropertyCustomerRent = require('../models/residentialPropertyCustomerRent');
const ResidentialCustomerRentLocation = require('../models/residentialCustomerRentLocation');

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
  const baseCoordinates = [72.8084232, 19.1392024];
  const customers = [];

  for (let i = 0; i < 5; i++) {
    const customerId = nanoid();
    const locationArea = Array.from({ length: 4 }, () => ({
      location: {
        type: 'Point',
        coordinates: generateRandomCoordinates(baseCoordinates, 10)
      },
      main_text: faker.address.streetName()
    }));

    const customer = {
      customer_id: customerId,
      agent_id: '3tHn5RqF_D7iU3OkqN_sL',
      customer_status: '1',
      is_close_successfully: 'no',
      customer_details: {
        name: faker.name.findName(),
        mobile1: faker.phone.phoneNumber('##########'),
        mobile2: faker.phone.phoneNumber('##########'),
        address: faker.address.streetAddress()
      },
      customer_locality: {
        city: 'Mumbai',
        location_area: locationArea,
        property_type: 'Residential',
        property_for: 'Rent',//faker.random.arrayElement(['Rent', 'Sell']),
        pin: faker.address.zipCode('######')
      },
      customer_property_details: {
        house_type: 'Apartment',
        bhk_type: faker.random.arrayElement(['1BHK', '2BHK', '3BHK']),
        furnishing_status: faker.random.arrayElement(['Full', 'Semi', 'Empty']),
        parking_type: faker.random.arrayElement(['Car', 'Bike']),
        lift: faker.random.boolean() ? 'Yes' : 'No'
      },
      customer_rent_details: {
        expected_rent: faker.random.number({ min: 10000, max: 100000 }).toString(),
        expected_deposit: faker.random.number({ min: 50000, max: 500000 }).toString(),
        available_from: formatDate(faker.date.future()),
        preferred_tenants: faker.random.arrayElement(['Family', 'Bachelors', 'Any']),
        non_veg_allowed: faker.random.boolean() ? 'Yes' : 'No'
      },
      image_urls: ['vichi1'],
      create_date_time: new Date(),
      update_date_time: new Date()
    };

    customers.push(customer);

    // Insert data into residentialCustomerRentLocation
    const rentLocations = locationArea.map(location => ({
      ...location,
      customer_id: customerId,
      agent_id: '3tHn5RqF_D7iU3OkqN_sL'
    }));

    await ResidentialCustomerRentLocation.insertMany(rentLocations);
    console.log("ResidentialCustomerRentLocation"+ JSON.stringify(rentLocations, null, 2) );
  }

  try {
    await ResidentialPropertyCustomerRent.insertMany(customers);
    console.log("ResidentialPropertyCustomer"+ JSON.stringify(customers, null, 2) );
    // console.log("5 dummy customers inserted successfully");
  } catch (error) {
    console.error("Error inserting dummy customers:", error);
  } finally {
    mongoose.connection.close();
  }
};

insertDummyData();
