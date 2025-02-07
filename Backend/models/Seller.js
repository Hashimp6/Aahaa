const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    place:{type:String},
    category: {
      type: String,
    },
    profileImage: { 
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'], 
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
      email: { type: String, trim: true },
    },
  
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
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Add these to your seller model
sellerSchema.index({ location: '2dsphere' });
sellerSchema.index({ badge: 1 });
sellerSchema.index({ category: 1 });
sellerSchema.index({ verified: 1 });
module.exports = mongoose.model('Seller', sellerSchema);
