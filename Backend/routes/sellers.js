const express = require("express");
const {
  registerSeller,
  getAllSellers,
  updateSellerDetails,
  getSellerById,
  deleteSeller,
} = require("../controllers/seller");

const sellerRoutes = express.Router();

// Seller routes
sellerRoutes.post("/register/:userId", registerSeller); // Register a new seller
sellerRoutes.get("/all", getAllSellers); // Get all sellers
sellerRoutes.get('/seller/:userId', getSellerById); // Get a specific seller by ID
sellerRoutes.patch('/:userId',updateSellerDetails); // Update a seller's details
sellerRoutes.delete('/:sellerId', deleteSeller);

module.exports = sellerRoutes;
