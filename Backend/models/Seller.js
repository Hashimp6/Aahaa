const mongoose = require('mongoose');
const sellerSchema = new mongoose.Schema({
   
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
    },
    profile:{type:String},
    location: {
      type: {
        type: String,
        enum: ['Point'], // GeoJSON Point
        default: 'Point',
      },
      coordinates: {
        type: [Number], 
      },
    },
    contact: {
      phone: String,
      instagram: String,
      whatsapp: String,
      address: String,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Seller posts schema (optional)
      },
    ],
    images: [String], // URLs of images (stored in Cloudinary or similar)
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Link to Product schema
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    badge: {
      type: String,
      enum: ['basic', 'silver', 'gold', 'premium'],
      default: 'basic',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  sellerSchema.index({ location: '2dsphere' }); // For geospatial queries
  module.exports = mongoose.model('Seller', sellerSchema);
  