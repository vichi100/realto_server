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
    property_type: String, // residential, commercial
    property_for: String, // rent ,sell
    pin: String
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
    preferred_tenants: String,
    non_veg_allowed: String
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

module.exports = mongoose.model("residential_customer", propertySchema);
