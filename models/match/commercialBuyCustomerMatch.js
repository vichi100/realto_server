const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  customer_id: String,
  agent_id: String,
  matched_count: Number,
  matched_propperty_id_mine: [],
  matched_propperty_id_other: [],
  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("commercial_buy_customer_match", propertySchema);