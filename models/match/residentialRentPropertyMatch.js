const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  property_id: String,
  agent_id: String,
  matched_count: Number,
  matched_customer_id_mine: [{
    customer_id: String,
    distance: Number
  }],
  matched_customer_id_other: [{
    customer_id: String,
    distance: Number
  }],
  
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("residential_rent_property_match", propertySchema);
