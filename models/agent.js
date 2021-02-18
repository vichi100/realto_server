const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const agentSchema = new Schema({
  agent_id: {
    type: String,
    required: true
  },

  expo_token: {
    type: String
  },

  agent_name: {
    type: String,
    required: true
  },
  company_name: {
    type: String
  },
  agent_mobile: {
    type: String,
    required: true
  },
  agent_address: {
    type: String
  },

  agent_city: {
    type: String
  },

  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("Agent", agentSchema);
