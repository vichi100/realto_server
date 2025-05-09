const mongoose = require("mongoose");
// var ObjectId = Schema.ObjectId;

const propertySchema = new mongoose.Schema({
  customer_id: String,
  agent_id: String,
  customer_status: { type: Number, default: 1 },// 0- close, 1- open
 
  customer_property_details: {
    building_type: String,
    property_used_for: String,
    property_size: String,
    parking_type: String,
  },

  customer_buy_details: {
    expected_buy_price: String,
    maintenance_charge: String,
    available_from: String,
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

});
propertySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("commercial_customer_buy_location", propertySchema);
