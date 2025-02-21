const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  property_id: String,
  agent_id: String,
  matched_customer_id_mine: [],
  matched_customer_id_other: [],
  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("commercial_buy_property_match", propertySchema);