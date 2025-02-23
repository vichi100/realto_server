const mongoose = require("mongoose");
// var ObjectId = Schema.ObjectId;

const propertySchema = new mongoose.Schema({
  customer_id: String,
  agent_id: String,
  // property_type: String,
  // property_for: String, // rent ,sell
  customer_status: String, // 0- close, 1- open
  is_close_successfully: String, // yes, no
  customer_details: {
    name: String,
    mobile1: String,
    mobile2: String,
    address: String
  },
  location: [// this we are using to display the location names on screen
    {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  ],
  customer_locality: {
    city: String,
    location_area: [],
    property_type: String,
    property_for: String, // rent ,sell
    pin: String
  },

  customer_property_details: {
    building_type: String,
    parking_type: String,
    property_used_for: String
  },

  customer_buy_details: {
    expected_buy_price: String,
    maintenance_charge: String,
    available_from: String,
    negotiable: String
  },

  reminders: [],
  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("commercial_customer", propertySchema);




// SAMPLE DATA 

// {
//   property_id: "12345",
//   agent_id: "67890",
//   property_type: "residential",
//   property_for: "rent",
//   property_status: "1",
//   is_close_successfully: "no",
//   owner_details: {
//     name: "John Doe",
//     mobile1: "1234567890",
//     mobile2: "",
//     address: "123 Main St"
//   },
//   location: [
//     {
//       type: "Point",
//       coordinates: [72.1234, 18.5678] // First location
//     },
//     {
//       type: "Point",
//       coordinates: [72.1245, 18.5689] // Second location
//     }
//   ],
//   property_address: {
//     city: "Mumbai",
//     main_text: "Near XYZ Mall",
//     formatted_address: "123 Main St, Mumbai",
//     flat_number: "101",
//     building_name: "ABC Apartments",
//     landmark_or_street: "Near XYZ Mall",
//     pin: "400001"
//   },
//   property_details: {
//     house_type: "Apartment",
//     bhk_type: "2 BHK",
//     washroom_numbers: "2",
//     furnishing_status: "Furnished",
//     parking_type: "Covered",
//     parking_number: "1",
//     property_age: "5",
//     floor_number: "3",
//     total_floor: "10",
//     lift: "Yes",
//     property_size: "1000 sqft"
//   },
//   rent_details: {
//     expected_rent: "18000",
//     expected_deposit: "90000",
//     available_from: "2023-10-01",
//     preferred_tenants: "Family",
//     non_veg_allowed: "No"
//   },
//   sell_details: {
//     expected_sell_price: "",
//     maintenance_charge: "",
//     available_from: "",
//     negotiable: ""
//   },
//   image_urls: [],
//   reminders: [],
//   create_date_time: new Date(),
//   update_date_time: new Date()
// }