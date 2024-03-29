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

  customer_rent_details: {
    expected_rent: String,
    expected_deposit: String,
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
