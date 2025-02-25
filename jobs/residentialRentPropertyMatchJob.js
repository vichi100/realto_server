// Description: Job to match residential rent properties with users.

// const cron = require('node-cron');
const schedule = require('node-schedule');
const mongoose = require('mongoose');
const residentialPropertyRent = require('../models/residentialPropertyRent');
const residentialCustomerRentLocation = require('../models/residentialCustomerRentLocation');
const residentialRentPropertyMatch = require('../models/match/residentialRentPropertyMatch');
const { json } = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb://realto:realto123@207.180.239.115:27017/realtodb');

schedule.scheduleJob('* * * * *', async () => {
  console.log('Updating Residential rent property match...');
  const residentialRentPropertyArr = await residentialPropertyRent.find();
  
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

    const matchedCustomerMine = [];
    const matchedCustomerOther = [];

    for (const customer of nearbyCustomersArr) {
      if (customer.agent_id === property.agent_id) {
        const obj = {
          customer_id: customer.customer_id,
          distance: customer.distance
        };
        matchedCustomerMine.push(obj);
      } else if (customer.agent_id !== property.agent_id) {
        const obj = {
          customer_id: customer.customer_id,
          distance: customer.distance
        };
        matchedCustomerOther.push(obj);
      }
    }

    const existingMatch = await residentialRentPropertyMatch.findOne({ property_id: property.property_id });

    if (existingMatch) {
      // Update existing match
      const updatedMine = [...existingMatch.matched_customer_id_mine];
      const updatedOther = [...existingMatch.matched_customer_id_other];

      matchedCustomerMine.forEach(customer => {
        if (!updatedMine.some(c => c.customer_id === customer.customer_id)) {
          updatedMine.push(customer);
        }
      });

      matchedCustomerOther.forEach(customer => {
        if (!updatedOther.some(c => c.customer_id === customer.customer_id)) {
          updatedOther.push(customer);
        }
      });

      await residentialRentPropertyMatch.updateOne(
        { property_id: property.property_id },
        {
          $set: {
            matched_customer_id_mine: updatedMine,
            matched_customer_id_other: updatedOther,
            matched_count: updatedMine.length + updatedOther.length,
            update_date_time: new Date()
          }
        }
      );
    } else {
      // Create new match
      const finalObj = {
        property_id: property.property_id,
        agent_id: property.agent_id,
        matched_count: matchedCustomerMine.length + matchedCustomerOther.length,
        matched_customer_id_mine: matchedCustomerMine,
        matched_customer_id_other: matchedCustomerOther,
        update_date_time: new Date()
      };
      // console.log('residentialRentPropertyMatch: '+ JSON.stringify(finalObj, null, 2) );
      await residentialRentPropertyMatch.create(finalObj);
    }
  }

  console.log('Residential rent property match done!');
});
