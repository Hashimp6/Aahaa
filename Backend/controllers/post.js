const { cloudinary_js_config } = require('../configs/cloudinary');
const Post = require('../models/Post');

// Create a new post and upload media to Cloudinary

const createPost = async (req, res) => {
    try {
        console.log("body is", req.body);
        const { description, seller } = req.body;

        // Validate file existence
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto',
            folder: 'posts' // optional - creates a folder in cloudinary
        });

        const newPost = new Post({
            media: result.secure_url,
            description,
            seller
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created successfully!', post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all posts by a specific user
const getPostsByUser = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const posts = await Post.find({ user: sellerId }).populate('seller');
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found!' });

        // Delete image using Cloudinary's public_id
        const result = await cloudinary_js_config.uploader.destroy(post.media.split('/').slice(-2).join('/').split('.')[0]);
        
        if (result.result !== 'ok') {
            return res.status(500).json({ message: "Failed to delete image from Cloudinary." });
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPost, getPostsByUser, deletePost };
