const mongooseDummy = require('@videsk/mongoose-dummy');
const agentSchema = require('../models/agent'); // Adjust the path to your User model

// Generate dummy data
const dummyUser = mongooseDummy(agentSchema, {
  ignore: ['_id', '__v'], // Fields to ignore
  returnDate: true // Return the data as an object
});

console.log(dummyUser);