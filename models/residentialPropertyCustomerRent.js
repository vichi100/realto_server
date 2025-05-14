const mongoose = require("mongoose");
// var ObjectId = Schema.ObjectId;

const propertySchema = new mongoose.Schema({
  customer_id: String,
  agent_id: String,
  property_type: String,
  property_for: String, // rent ,sell
  customer_status: { type: Number, default: 1 }, // 0- close, 1- open
  is_close_successfully: String, // yes, no, open
  match_count: { type: Number, default: 0 },
  customer_details: {
    name: String,
    mobile1: String,
    address: String,
  },
  customer_locality: {
    city: String,
    location_area: [],
    property_type: String, // residential, commercial
    property_for: String, // rent ,sell
    preferred_tenants: String,// "Family", "Bachelors"
  },

  customer_property_details: {
    house_type: String,
    bhk_type: String,
    furnishing_status: String,
    parking_type: String,
    lift: String
  },

  customer_rent_details: {
    expected_rent: String,
    expected_deposit: String,
    available_from: String,
  },

  reminders: [],
  assigned_to_employee:{ type: String, default: [] },
  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("residential_customer_rent", propertySchema);


// write a function to insert data mongodb for schema residentialPropertyCustomer in insertResidentialPropertyCustomer.js file. flllow below instructions:
// 1) ignore all Comments
// 2) use faker to generate dummy data for residentialPropertyCustomer schema
// 3) insert 50 dummy data in residentialPropertyCustomer schema
// 4) location_area coordinates should be random within 10km of below location
// "coordinates": [
//         72.8084232,
//         19.1392024
//       ],
// 5) customer_locality city must be mumbai
// 6) customer_details should be indian name and mobile number
// 7) agent_id must be 2WfWC8MFzlCmWIUYougXd for all data
// 8) customer_id should be unique for all data

// use below samlple data for reference

// sample data
{/* 
  
  
  {
    _id: ObjectId('67ba5949ea0cb014162a1a18'),
    customer_id: 'tlPRcjfqLgFPq_KRxyIJ3',
    agent_id: '2WfWC8MFzlCmWIUYougXd',
    customer_details: {
      name: 'Vichi',
      mobile1: '9833097597',
      mobile2: '9833097597',
      address: '101 parag building Versova beach'
    },
    customer_locality: {
      city: 'Mumbai',
      location_area: [
        {
          location: { type: 'Point', coordinates: [ 72.8146101, 19.1350852 ] },
          main_text: 'Versova, Andheri West'
        },
        {
          location: { type: 'Point', coordinates: [ 72.8084232, 19.1392024 ] },
          main_text: 'Yari Road - Versova Bus Depot Canteen'
        },
        {
          location: { type: 'Point', coordinates: [ 72.8246291, 19.1435906 ] },
          main_text: 'Lokhandwala, Andheri West'
        },
        {
          location: {
            type: 'Point',
            coordinates: [ 72.82982659999999, 19.11607369999999 ]
          },
          main_text: 'Juhu Circle'
        }
      ],
      property_type: 'Residential',
      property_for: 'Rent',
      pin: '123'
    },
    customer_property_details: {
      house_type: 'Apartment',
      bhk_type: '2BHK',
      furnishing_status: 'Full',
      parking_type: 'Car',
      lift: 'Yes'
    },
    image_urls: [ 'vichi1' ],
    create_date_time: ISODate('2025-02-22T23:10:01.568Z'),
    update_date_time: ISODate('2025-02-22T23:10:01.568Z'),
    customer_rent_details: {
      expected_rent: '55000',
      expected_deposit: '200000',
      available_from: 'Mon Mar 31 2025',
      preferred_tenants: null,
      non_veg_allowed: null
    }
  }

  
  
  
  
  */}