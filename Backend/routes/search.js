const express = require("express");
const { getNearestSellers, getSellersByCategory } = require("../controllers/search");


const searchRoutes = express.Router();
searchRoutes.get('/nearest-sellers', getNearestSellers);

// Route for nearest sellers by location and category
searchRoutes.get('/sellers-by-category', getSellersByCategory);


module.exports = searchRoutes;
