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
  access_rights: String, // employee, agent
  employees: [], // if employee then it will be empty,
  works_for: String,// Agent id for which the employee works
  liked_properties: [],
  liked_customers: [],
  email: String,
  user_status: { type: String, default: "active" },  //"active", suspend, blocked, removed
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
