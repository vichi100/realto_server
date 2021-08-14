const mongoose = require("mongoose");
// var ObjectId = Schema.ObjectId;

const propertySchema = new mongoose.Schema({
  customer_id: String,
  customer_status: String, // 0- close, 1- open
  customer_details: {
    name: String,
    mobile1: String,
  },
  customer_locality: {
    city: String,
    location_area: [],
    property_type: String, // residential, commercial
    property_for: String, // rent ,sell
  },

  customer_property_details: {
    house_type: String,
    bhk_type: String,
    furnishing_status: String,
  },

  customer_rent_details: {
    expected_rent: String,
    expected_deposit: String,
  },

  customer_buy_details: {
    expected_buy_price: String
  },

});

module.exports = mongoose.model("residential_customer_location", propertySchema);
