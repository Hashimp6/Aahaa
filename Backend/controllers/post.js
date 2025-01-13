const cloudinary = require("../configs/cloudinary");
const Post = require("../models/Post"); // Update this import
const fs = require("fs");

const createPost = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { description, seller } = req.body;

    // Validate file existence
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "posts",
    });

    // Create new post with media URL
    const newPost = new Post({
      media: result.secure_url, // Add this back
      description,
      seller,
    });

    await newPost.save();

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });

    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all posts by a specific user
const getPostsByUser = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const posts = await Post.find({ seller: sellerId }).populate("seller");
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

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/posts/filename.jpg
        const publicId = post.media.split('/').slice(-2).join('/').split('.')[0];
        
        try {
            // Delete image from Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);
            
            if (result.result !== "ok") {
                console.error("Cloudinary deletion failed:", result);
                return res.status(500).json({ 
                    message: "Failed to delete image from Cloudinary.",
                    details: result
                });
            }
        } catch (cloudinaryError) {
            console.error("Cloudinary error:", cloudinaryError);
            // Continue with post deletion even if Cloudinary deletion fails
        }

        // Delete the post from database
        await Post.findByIdAndDelete(postId);
        
        res.status(200).json({ 
            message: "Post deleted successfully!",
            postId: postId
        });

    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ 
            message: "Failed to delete post",
            error: error.message 
        });
    }
};

module.exports = { createPost, getPostsByUser, deletePost };
