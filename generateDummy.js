const mongoose = require("mongoose");
const dummy = require("mongoose-dummy");
const agentSchema = require("../realto_server/models/agent");

// https://github.com/videsk/mongoose-dummy/blob/main/test/models/user.js
// https://github.com/videsk/mongoose-dummy


// Exclude specific fields
const ignoredFields = ["_id", "__v"];

// Generate dummy user data
const dummyUser = dummy(agentSchema, {
  ignore: ignoredFields,
  returnDate: true, // To generate random date values
});

console.log(dummyUser);
