const express = require("express");
const multer = require("multer");
const upload = require("../configs/multer");
const { createStories, getStoriesByUser, deleteStories } = require("../controllers/stories");

const storiesRouter = express.Router();

storiesRouter.post('/create', upload.single('media'), createStories);

// GET route to retrieve posts by a specific user
storiesRouter.get("/seller/:sellerId", getStoriesByUser);

// DELETE route to delete a post by its ID
storiesRouter.delete("/:storyId", deleteStories);

module.exports = storiesRouter;
