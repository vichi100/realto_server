const mongoose = require("mongoose");
// var ObjectId = Schema.ObjectId;

const propertySchema = new mongoose.Schema({
  property_id: String,
  agent_id: String,
  property_type: String,
  property_for: String,
  property_status: String, // 0- close, 1- open
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
    main_text: String,
    formatted_address: String,
    flat_number: String,
    building_name: String,
    landmark_or_street: String,
    pin: String
  },

  property_details: {
    property_used_for: String,
    building_type: String,
    ideal_for: [],
    parking_type: String,
    property_age: String,
    power_backup: String,
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

module.exports = mongoose.model("commercial_property_sell", propertySchema);
