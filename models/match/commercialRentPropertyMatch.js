const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  property_id: String,
  agent_id: String,
  match_count: { type: Number, default: 0 },
  matched_customer_id_mine: [{
    matched_percentage: Number,
    customer_id: String,
    distance: Number
  }],
  matched_customer_id_other: [{
    matched_percentage: Number,
    customer_id: String,
    distance: Number
  }],
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("commercial_rent_property_match", propertySchema);