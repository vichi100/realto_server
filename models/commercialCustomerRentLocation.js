const mongoose = require("mongoose");
// var ObjectId = Schema.ObjectId;

const propertySchema = new mongoose.Schema({
  customer_id: String,
  agent_id: String,
  customer_status: { type: Number, default: 1 },// 0- close, 1- open
  customer_locality: {
    property_type: String,
    property_for: String, // rent ,sell
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

module.exports = mongoose.model("commercial_customer_rent_location", propertySchema);
