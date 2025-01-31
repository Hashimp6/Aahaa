const express = require("express");
const { getNearestSellers, getSellersByCategory, searchSellers } = require("../controllers/search");


const searchRoutes = express.Router();
searchRoutes.get('/nearest-sellers', getNearestSellers);

// Route for nearest sellers by location and category
searchRoutes.get('/sellers-by-category', getSellersByCategory);
searchRoutes.get('/search-sellers', searchSellers);


module.exports = searchRoutes;
