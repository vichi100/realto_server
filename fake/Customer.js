const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  location: [
    {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (value) {
            return value.length === 2;
          },
          message: 'Coordinates must have exactly [longitude, latitude].'
        }
      }
    }
  ]
});

// Create a geospatial index
CustomerSchema.index({ location: '2dsphere' });

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
