const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  customer_id: String,
  agent_id: String,
  matched_count: Number,
  matched_customer_id_mine: [{
    matched_percentage: Number,
    customer_id: String
  }],
  matched_customer_id_other: [{
    matched_percentage: Number,
    customer_id: String
  }],
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("residential_buy_customer_match", propertySchema);