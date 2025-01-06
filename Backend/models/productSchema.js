const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true
    },
    productName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    productImage: {
      type: String,
      required: true
    },
   
    stars: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  
 
  
  const Product = mongoose.model('Product', productSchema);
  module.exports = Product;