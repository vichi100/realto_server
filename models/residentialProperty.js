const mongoose = require("mongoose");
// var ObjectId = Schema.ObjectId;

const propertySchema = new mongoose.Schema({
  property_id: String,
  agent_id: String,
  property_type: String, // residential, commercial
  property_for: String, // rent ,sell
  property_status: String, // 0- close, 1- open
  is_close_successfully: String, // yes, no
  owner_details: {
    name: String,
    mobile1: String,
    mobile2: String,
    address: String
  },
  location: {
    type: String,
    coordinates: []
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

  rent_details: {
    expected_rent: String,
    expected_deposit: String,
    available_from: String,
    preferred_tenants: String,
    non_veg_allowed: String
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

module.exports = mongoose.model("residential_property", propertySchema);
