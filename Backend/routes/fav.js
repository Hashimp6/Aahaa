// routes/favoriteRoutes.js
const express = require('express');
const favRouter = express.Router();
const {
    addFavoriteSeller,
    removeFavoriteSeller,
    getFavoriteSellers
} = require('../controllers/fav');

favRouter.post('/add-favorite', addFavoriteSeller);  // Add seller to favorites
favRouter.post('/remove-favorite', removeFavoriteSeller); // Remove seller from favorites
favRouter.get('/favorites/:userId', getFavoriteSellers); // Get all favorite sellers for a user

module.exports = favRouter;
