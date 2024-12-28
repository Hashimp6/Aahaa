const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  contact: {
    phone: String,
    address: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      default: 'Point',
    },
    coordinates: {
      type: [Number], // Expecting [longitude, latitude]
      default: [0, 0], // Default location (can be updated later)
    },
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
  ],
  sellerDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller', // Reference to the Seller schema
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({ location: '2dsphere' }); // For geospatial queries
module.exports = mongoose.model('User', userSchema);
