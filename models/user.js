const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_type: String, // employee or agent
  id: String,
  expo_token: String,
  name: String,
  company_name: String,
  mobile: String,
  address: String,
  city: String,
  access_rights: String,
  employees: [], // if employee then it will be empty,
  works_for: [],
  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("User", userSchema);

// employees=[
//   { employee_id: String, employee_name: String, employee_mobile: String, access_rights:String}
// ]
