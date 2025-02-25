// Description: Job to match residential rent properties with users.

// const cron = require('node-cron');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const residentialPropertyRent = require('../models/residentialPropertyRent');
const residentialCustomerRentLocation = require('../models/residentialCustomerRentLocation');
const residentialRentPropertyMatch = require('../models/match/residentialRentPropertyMatch');

// Connect to MongoDB
mongoose.connect('mongodb://realto:realto123@207.180.239.115:27017/realtodb');

schedule.scheduleJob('* * * * *', async () => {
  console.log('Updating Residnetial rent property match...');
  const residentialRentPropertyArr = await residentialPropertyRent.find();
  const matchedCustomerMine = [];
  const matchedCustomerOther = [];

  for (const property of residentialRentPropertyArr) {
    const propertyLocation = property.location;

    // Find customers whose interestedLocations are within 5km of the property's location
    const nearbyCustomersArr = await residentialCustomerRentLocation.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: propertyLocation.coordinates },
          distanceField: "distance",
          maxDistance: 5000, // 5km in meters
          spherical: true
        }
      }
    ]);

    for(const customer of nearbyCustomersArr) {
      if(customer.agent_id === property.agent_id) {
        const obj = {
          customer_id: customer.customer_id,
          distance: customer.distance
        }
        matchedCustomerMine.push(obj);
      }else if(customer.agent_id !== property.agent_id) {
        const obj = {
          customer_id: customer.customer_id,
          distance: customer.distance
        }
        matchedCustomerOther.push(obj);
      }
    }
    const finalObj = {
      property_id: property.property_id,
      agent_id: property.agent_id,
      matched_count: matchedCustomerMine.length+matchedCustomerOther.length,
      matched_customer_id_mine: matchedCustomerMine,
      matched_customer_id_other: matchedCustomerOther,
      update_date_time: new Date(),
    }
    console.log('residentialRentPropertyMatch'+ JSON.stringify(finalObj, null, 2));
    // residentialRentPropertyMatch.create(finalObj);
    
  }
  

  console.log('Residnetial rent property match done!');
});

// 1) get location of property, check the table of customer residentialCustomerRentLocation to find out the customers which 
// shown interest within 5km of the property location
// 2) get the details of the customers from residentialCustomerRentDetails table
// 3) match the property details with the customer details
// 4) if the property details match with the customer details then send the notification to the customer
// console.log('Property:', property);

    // const obj = {
    //   property_id: property.property_id,
    //   agent_id: property.agent_id,
    //   customer_id: nearbyCustomers.map(customer => ({
    //     customer_id: customer.customer_id,
        
    //     distance: customer.distance
    //   }))
    // };

    // result.push(obj);
