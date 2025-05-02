// Description: Job to match residential rent properties with users.

const schedule = require('node-schedule');
const mongoose = require('mongoose');
const commercialPropertySell = require('../models/commercialPropertySell');
const commercialCustomerBuyLocation = require('../models/commercialCustomerBuyLocation');
const commercialBuyPropertyMatch = require('../models/match/commercialBuyPropertyMatch');
const commercialBuyCustomerMatch = require('../models/match/commercialBuyCustomerMatch');
const commercialPropertyCustomerBuy = require('../models/commercialPropertyCustomerBuy');
const { json } = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb://realto:realto123@207.180.239.115:27017/realtodb');

schedule.scheduleJob('*/10 * * * * *', async () => {
  console.log('Updating Commercial Buy/Sell property match ...');
  const residentialRentPropertyArr = await commercialPropertySell.find().lean().exec();
  
  for (let property of residentialRentPropertyArr) {
    const xy = JSON.stringify(property)
    console.log("property:  "+JSON.stringify(property.
      property_id, null, 2));
    const propertyLocation = property.location;
    const availableFromDate = new Date(property.sell_details.available_from);
    const minDate = new Date(availableFromDate);
    minDate.setDate(minDate.getDate() - 180);
    const maxDate = new Date(availableFromDate);
    maxDate.setDate(maxDate.getDate() + 30);

    // Find customers whose interestedLocations are within 5km of the property's location and match BHK type
    // make these customer entry in matched customer list for the property
    // make this property entry in matched property list for the customer
    // if nearbyCustomersArr has 5 customers then all five customer will be added in property's customer list
    // if nearbyCustomersArr has 5 customers then this property will be also added in all customer's property list
    const nearbyCustomersArr = await commercialCustomerBuyLocation.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: propertyLocation.coordinates },
          distanceField: "distance",
          maxDistance: 5000, // 5km in meters
          spherical: true
        }
      },
      // {
      //   $match: {
      //     "customer_property_details.bhk_type": property.property_details.bhk_type,
      //     // "customer_rent_details.available_from": { $gte: minDate, $lte: maxDate }
      //   }
      // }
    ]);

    const matchedCustomerMine = [];
    const matchedCustomerOther = [];
    const uniqueCustomerMine = new Set();
    const uniqueCustomerOther = new Set();
    // here apply other condition to match like rent, deposit, bhk, furnishing_status, parking_type, lift, preferred_tenants, non_veg allowed
    // order location > bhk > rent > deposit > preferred_tenants > furnishing_status > parking type > non_veg_allowed
    // location + bhk = 60% < must match>
    // location + bhk + rent range  = 70-80% ( range will be 20%)
    // location + bhk + rent range + deposit range = 90% ( range will be 50 %)
    // location + bhk + rent range + deposit range + preferred_tenants = 95 %
    // location + bhk + rent range + deposit range + preferred_tenants+ furnishing_status = 97 %
    // location + bhk + rent range + deposit range + preferred_tenants+ furnishing_status = 98 %

    for (const customer of nearbyCustomersArr) {
      let matchScore = 60;

      // Check rent range
      const rentDiff = Math.abs(property.sell_details.
        expected_sell_price - customer.customer_buy_details.
        expected_buy_price);
      const rentRange = customer.customer_buy_details.
      expected_buy_price * 0.2;
      if (rentDiff <= rentRange) {
        matchScore += 10 * (1 - rentDiff / rentRange);
      }

      // // Check deposit range
      // const depositDiff = Math.abs(property.sell_details.expected_deposit - customer.customer_buy_details.expected_deposit);
      // const depositRange = customer.customer_buy_details.expected_deposit * 0.5;
      // if (depositDiff <= depositRange) {
      //   matchScore += 10 * (1 - depositDiff / depositRange);
      // }

      // Check furnishing status
      const idealFor = property.property_details.ideal_for
      for(let idealIs of idealFor){
        if (idealIs === customer.customer_property_details.property_used_for) {
          matchScore += 1;
          break;
        }

      }
      

      // Check furnishing status
      if (property.property_details.property_used_for === customer.customer_property_details.property_used_for) {
        matchScore += 2;
      }

      // Check parking type
      if (property.property_details.building_type === customer.customer_property_details.building_type) {
        matchScore += 1;
      }

      // Check parking type
      if (property.property_details.parking_type === customer.customer_property_details.parking_type) {
        matchScore += 1;
      }

      // Check parking type
      // 1) match this + 30% of property_size
      // 2) match this  - 20% of property_size
      // 3) add % of 2 accoringly
      const propertySize = property.property_details.property_size;
      const customerSize = customer.customer_property_details.property_size;
      const sizeDiff = Math.abs(propertySize - customerSize);
      const sizeRangePlus = propertySize * 0.3;
      const sizeRangeMinus = propertySize * 0.2;
      if (sizeDiff <= sizeRangePlus) {
        matchScore += 1 * (1 - sizeDiff / sizeRangePlus);
      } else if (sizeDiff <= sizeRangeMinus) {
        matchScore += 1 * (1 - sizeDiff / sizeRangeMinus);
      }

      // Check available_from date range
      const customerAvailableFromDate = new Date(customer.customer_buy_details.available_from);
      const dateDiff = Math.abs(availableFromDate - customerAvailableFromDate);
      const dateRange = 90 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      if (dateDiff <= dateRange) {
        matchScore += 1 * (1 - dateDiff / dateRange);
      }

      if (matchScore >= 60) { // Only consider matches with a score of 60 or higher
        if (customer.agent_id === property.agent_id) {
          if (!uniqueCustomerMine.has(customer.customer_id)) {
            const obj = {
              customer_id: customer.customer_id,
              distance: customer.distance,
              matched_percentage:  Math.ceil(matchScore)
            };
            matchedCustomerMine.push(obj);
            uniqueCustomerMine.add(customer.customer_id);
          }
        } else if (customer.agent_id !== property.agent_id) {
          if (!uniqueCustomerOther.has(customer.customer_id)) {
            const obj = {
              customer_id: customer.customer_id,
              agent_id: customer.agent_id,
              distance: customer.distance,
              matched_percentage:  Math.ceil(matchScore)
            };
            matchedCustomerOther.push(obj);
            uniqueCustomerOther.add(customer.customer_id);
          }
        }
      }

      // Insert matched properties into commercialBuyCustomerMatch
      const existingCustomerMatch = await commercialBuyCustomerMatch.findOne({ customer_id: customer.customer_id }).lean().exec();

      if (existingCustomerMatch) {
        // Update existing customer match
        const updatedMine = [...existingCustomerMatch.matched_property_id_mine];
        const updatedOther = [...existingCustomerMatch.matched_property_id_other];

        if (customer.agent_id === property.agent_id) {
          if (!updatedMine.some(p => p.property_id === property.property_id)) {
            updatedMine.push({
              property_id: property.property_id,
              distance: customer.distance,
              matched_percentage: Math.ceil(matchScore)
            });
          }
        } else {
          if (!updatedOther.some(p => p.property_id === property.property_id)) {
            updatedOther.push({
              property_id: property.property_id,
              agent_id: property.agent_id,
              distance: customer.distance,
              matched_percentage: Math.ceil(matchScore)
            });
          }
        }

        await commercialBuyCustomerMatch.updateOne(
          { customer_id: customer.customer_id },
          {
            $set: {
              matched_property_id_mine: updatedMine,
              matched_property_id_other: updatedOther,
              match_count: updatedMine.length + updatedOther.length,
              update_date_time: new Date()
            }
          }
        );

        // Update match count in residentialPropertyCustomerRent schema document
        await commercialPropertyCustomerBuy.updateOne(
          { customer_id: customer.customer_id },
          { $set: { match_count: updatedMine.length + updatedOther.length } }
        );
      } else {
        // Create new customer match
        const finalCustomerObj = {
          customer_id: customer.customer_id,
          agent_id: customer.agent_id,
          match_count: customer.agent_id === property.agent_id ? 1 : 0,
          matched_property_id_mine: customer.agent_id === property.agent_id ? [{
            property_id: property.property_id,
            distance: customer.distance,
            matched_percentage: Math.ceil(matchScore)
          }] : [],
          matched_property_id_other: customer.agent_id !== property.agent_id ? [{
            property_id: property.property_id,
            agent_id: property.agent_id,
            distance: customer.distance,
            matched_percentage: Math.ceil(matchScore)
          }] : [],
          update_date_time: new Date()
        };
        await commercialBuyCustomerMatch.create(finalCustomerObj);

        // Update match count in residentialPropertyCustomerRent schema document
        await commercialPropertyCustomerBuy.updateOne(
          { customer_id: customer.customer_id },
          { $set: { match_count: finalCustomerObj.matched_property_id_mine.length + finalCustomerObj.matched_property_id_other.length } }
        );
      }
    }

    const existingMatch = await commercialBuyPropertyMatch.findOne({ property_id: property.property_id   }).lean().exec();

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

      await commercialBuyPropertyMatch.updateOne(
        { property_id: property.property_id },
        {
          $set: {
            matched_customer_id_mine: updatedMine,
            matched_customer_id_other: updatedOther,
            match_count: updatedMine.length + updatedOther.length,
            update_date_time: new Date()
          }
        }
      );
    } else {
      // Create new match
      const finalObj = {
        property_id: property.property_id,
        agent_id: property.agent_id,
        match_count: matchedCustomerMine.length + matchedCustomerOther.length,
        matched_customer_id_mine: matchedCustomerMine,
        matched_customer_id_other: matchedCustomerOther,
        update_date_time: new Date()
      };
      console.log('Creating new Obj: '+ JSON.stringify(finalObj.property_id, null, 2) );
      await commercialBuyPropertyMatch.create(finalObj);
    }

    // Update match count in commercialPropertySell schema document
    await commercialPropertySell.updateOne(
      { property_id: property.property_id },
      { $set: { match_count: matchedCustomerMine.length + matchedCustomerOther.length } }
    );
  }

  console.log('Commercial Buy/Sell property match done!');
});
