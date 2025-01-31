const express = require("express");
const router = express.Router();
const { toggleFavorite, getFavorites } = require("../controllers/favoritesController");


router.post("/toggle/:sellerId",  toggleFavorite);
router.get("/all", getFavorites);

module.exports = router;
