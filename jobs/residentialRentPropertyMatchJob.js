// Description: Job to match residential rent properties with users.

const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('../models/user'); // Example Mongoose model
const residentialProperty = require('../models/residentialProperty');
const residentialCustomerRentLocation = require('../models/residentialCustomerRentLocation');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb');

cron.schedule('0 0 * * 0', async () => {
  console.log('Running database cleanup...');
  const residentialRentPropertyArr = await residentialProperty.find({ property_type: 'residential', property_for: 'rent' });
  const result = [];

  for (const property of residentialRentPropertyArr) {
    const propertyLocation = property.location;

    // Find customers whose interestedLocations are within 5km of the property's location
    const nearbyCustomers = await residentialCustomerRentLocation.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: propertyLocation.coordinates },
          distanceField: "distance",
          maxDistance: 5000, // 5km in meters
          spherical: true
        }
      }
    ]);

    const obj = {
      property_id: property.property_id,
      agent_id: property.agent_id,
      customer_id: nearbyCustomers.map(customer => ({
        customer_id: customer.customer_id,
        
        distance: customer.distance
      }))
    };

    result.push(obj);
  }

  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('Cleanup done!');
});

// 1) get location of property, check the table of customer residentialCustomerRentLocation to find out the customers which 
// shown interest within 5km of the property location
// 2) get the details of the customers from residentialCustomerRentDetails table
// 3) match the property details with the customer details
// 4) if the property details match with the customer details then send the notification to the customer
