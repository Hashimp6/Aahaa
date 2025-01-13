const express = require("express");
const multer = require("multer");
const {
  createPost,
  getPostsByUser,
  deletePost,
} = require("../controllers/post");
const upload = require("../configs/multer");

const postRouter = express.Router();

postRouter.post('/create', upload.single('media'), createPost);

// GET route to retrieve posts by a specific user
postRouter.get("/seller/:sellerId", getPostsByUser);

// DELETE route to delete a post by its ID
postRouter.delete("/:postId", deletePost);

module.exports = postRouter;
