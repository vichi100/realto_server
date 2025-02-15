const mongoose = require("mongoose");

// Define Mongoose Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  isAdmin: Boolean,
});

// Export the schema (not the model)
module.exports = UserSchema;
