const mongoose = require("mongoose");
const residentialProperty = require("./residentialProperty");
const { faker } = require("@faker-js/faker");
// var ObjectId = Schema.ObjectId;

const propertySchema = new mongoose.Schema({
  property_id: String,
  agent_id: String,
  property_type: String, // residential, commercial
  property_for: String, // rent ,sell
  property_status: { type: Number, default: 1 }, // 0- close, 1- open
  is_close_successfully: String, // yes, no
  match_count: { type: Number, default: 0 },
  owner_details: {
    name: String,
    mobile1: String,
    mobile2: String,
    address: String
  },
  location: {
    type: {
      type: String, // GeoJSON type (e.g., "Point")
      enum: ["Point"], // Only "Point" is allowed in this case
      required: true
    },
    coordinates: {
      type: [Number], // Array of numbers: [longitude, latitude]
      required: true
    }
  }, 
  
  property_address: {
    city: String,
    // location_area: String,
    main_text: String,
    formatted_address: String,
    flat_number: String,
    building_name: String,
    landmark_or_street: String,
    pin: String
  },

  property_details: {
    house_type: String,
    bhk_type: String,
    washroom_numbers: String,
    furnishing_status: String,
    parking_type: String,
    parking_number: String,
    property_age: String,
    floor_number: String,
    total_floor: String,
    lift: String,
    property_size: String
  },

  sell_details: {
    expected_sell_price: String,
    maintenance_charge: String,
    available_from: String,
    negotiable: String
  },

  image_urls: [],
  reminders: [],
  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

propertySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("residential_property_sell", propertySchema);

// write a function to insert data mongodb for schema residentialProperty in insertResidentialProperty.js file. flllow below instructions:
// 1) ignore all Comments
// 2) use faker to generate dummy data for residentialProperty schema
// 3) insert 50 dummy data in residentialProperty schema
// 4) location cordinated should be random within 10km of below location
// "coordinates": [
//         72.8084232,
//         19.1392024
//       ],
// 5) property_address should be from mumbai city
// 6) owner_details should be indian name and mobile number
// 7) agent_id must be 2WfWC8MFzlCmWIUYougXd for all data
// 8) property_id should be unique for all data

// use below samlple data for reference


// {
//   "_id": "67ba4ee551687a0dedc23c38",
//   "agent_id": "2WfWC8MFzlCmWIUYougXd",
//   "create_date_time": "2025-02-22T22:25:41.292Z",
//   "image_urls": [
//     {
//       "url": "/01/07/9/2WfWC8MFzlCmWIUYougXd_0_1740263141281.jpeg"
//     },
//     {
//       "url": "/01/07/9/2WfWC8MFzlCmWIUYougXd_1_1740263141291.jpeg"
//     },
//     {
//       "url": "/01/07/9/2WfWC8MFzlCmWIUYougXd_2_1740263141291.jpeg"
//     }
//   ],
//   "location": {
//     "coordinates": [
//       72.8084232,
//       19.1392024
//     ],
//     "type": "Point"
//   },
//   "owner_details": {
//     "address": "Yari Road Mumbai",
//     "mobile1": "9833097596",
//     "mobile2": "9833097596",
//     "name": "Balu"
//   },
//   "property_address": {
//     "building_name": "ZA tower",
//     "city": "Mumbai",
//     "flat_number": "301",
//     "formatted_address": "203, sunderwan, Kanakia Apartment, Sai Nagar, Versova, Andheri West, Mumbai, Maharashtra 400067, India",
//     "landmark_or_street": "Yari road",
//     "main_text": "Yari Road - Versova Bus Depot Canteen",
//     "pin": "123"
//   },
//   "property_details": {
//     "bhk_type": "2BHK",
//     "floor_number": "4",
//     "furnishing_status": "Full",
//     "house_type": "Apartment",
//     "lift": "Yes",
//     "parking_number": "1",
//     "parking_type": "Car",
//     "property_age": "1-5",
//     "property_size": "900",
//     "total_floor": "25",
//     "washroom_numbers": "2"
//   },
//   "property_for": "Rent",
//   "property_id": "U9Q_cmwXrf24qooQx546V",
//   "property_type": "Residential",
//   "rent_details": {
//     "available_from": "Fri Feb 28 2025",
//     "expected_deposit": "150000",
//     "expected_rent": "45000",
//     "non_veg_allowed": "Yes",
//     "preferred_tenants": "Family"
//   },
//   "update_date_time": "2025-02-22T22:25:41.292Z"
// }
