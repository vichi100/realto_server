const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_type: String, // employee or agent
  id: String,
  works_for: String,// Agent id for which the employee works
  expo_token: String,
  name: String,
  company_name: String,
  mobile: String,
  address: String,
  city: String,
  access_rights: String, // employee, agent
  employee_ids: {type: [String],default: []}, // if employee then it will be empty,
  liked_properties: {type: [String],default: []},
  liked_customers: {type: [String],default: []},
  assigned_residential_rent_properties:{type: [String],default: []},
  assigned_residential_sell_properties:{type: [String],default: []},
  assigned_commercial_rent_properties:{type: [String],default: []},
  assigned_commercial_sell_properties:{type: [String],default: []},
  assigned_residential_rent_customers:{type: [String],default: []},
  assigned_residential_buy_customers:{type: [String],default: []},
  assigned_commercial_rent_customers:{type: [String],default: []},
  assigned_commercial_buy_customers:{type: [String],default: []},
  email: String,
  user_status: { type: String, default: "active" },  //"active", suspend, blocked, removed
  create_date_time: {
    type: Date
  },
  update_date_time: {
    type: Date
  }
});

module.exports = mongoose.model("user", userSchema);

// employees=[
//   { employee_id: String, employee_name: String, employee_mobile: String, access_rights:String}
// ]
