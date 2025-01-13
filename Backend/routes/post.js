const express = require('express');
const multer = require('multer');
const { createPost, getPostsByUser, deletePost } = require('../controllers/post');

const postRouter = express.Router();

// Configure Multer for file uploads (store temporarily in the 'uploads/' folder)
const upload = multer({ dest: 'uploads/' });

// POST route to create a new post
postRouter.post('/create', upload.single('media'), createPost);

// GET route to retrieve posts by a specific user
postRouter.get('/user/:userId', getPostsByUser);

// DELETE route to delete a post by its ID
postRouter.delete('/:postId', deletePost);

module.exports = postRouter;
