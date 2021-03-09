const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reminderSchema = new Schema({
  reminder_id: {
    type: String
  },
  agent_id: String,
  property_id: [],

  property_type: String, // commercial, residential
  expo_token: {
    type: String
  },

  reminder_for: {
    // call, meeting, prop visit
    type: String,
    required: true
  },
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

module.exports = mongoose.model("Reminder", reminderSchema);
