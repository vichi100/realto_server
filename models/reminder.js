const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reminderSchema = new Schema({
  reminder_id: {
    type: String
  },
  user_id: String, // agent_id
  user_id_secondary: String, // in case of other agent_id
  category_ids: [], // property_id or buyer_id
  category: String, // property, customer
  category_type: String, // commercial, residential
  category_for: String, // buy, sell rent
  is_mine_propert_or_customer: String, // mine, other
  expo_token: {
    type: String
  },

  reminder_for: {
    // call, meeting, prop visit
    type: String,
    required: true
  },
  client_id: String, // Customer id
  client_name: {
    type: String
  },
  client_mobile: {
    type: String,
    required: true
  },
  meeting_date: {
    type: String
  },

  meeting_time: {
    type: String
  },

  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("reminders", reminderSchema);
