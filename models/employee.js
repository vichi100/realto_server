const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
  user_type: String, // employee or agent
  agent_ids: [],
  id: String,
  expo_token: String,
  name: String,
  mobile: String,
  company_name: String,
  // agent_address: String,
  city: String,
  access_rights: String, // read , edit
  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("Employee", employeeSchema);

// employees=[
//   { employee_id: String, employee_name: String, employee_mobile: String, access_rights:String}
// ]
