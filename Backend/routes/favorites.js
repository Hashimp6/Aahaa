const express = require("express");
const favoriteRouter = express.Router();
const { toggleFavorite, getFavorites } = require("../controllers/favoritesController");


favoriteRouter.post("/addorremove",  toggleFavorite);
favoriteRouter.get("/all", getFavorites);

module.exports =favoriteRouter;
