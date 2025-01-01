const express = require("express");
const {
  registerSeller,
  getAllSellers,
  updateSellerDetails,
  getSellerById,
  deleteSeller,
} = require("../controllers/seller");

const sellerRoutes = express.Router();
const upload = require('../configs/multer');

// Add multer middleware to handle multipart form data
sellerRoutes.post('/register/:userId', upload.single('profileImage'), registerSeller);// Register a new seller
sellerRoutes.get("/all", getAllSellers); // Get all sellers
sellerRoutes.get('/seller/:userId', getSellerById); // Get a specific seller by ID
sellerRoutes.patch('/:userId',updateSellerDetails); // Update a seller's details
sellerRoutes.delete('/:sellerId', deleteSeller);

module.exports = sellerRoutes;
