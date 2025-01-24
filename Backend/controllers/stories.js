const cloudinary = require("../configs/cloudinary");
const Stories = require("../models/Stories");
const fs = require("fs");

// Create a new story
const createStories = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        const { description, seller } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "posts",
        });

        // Create a new story with the uploaded media
        const newStory = new Stories({
            media: result.secure_url,
            description,
            seller,
        });

        await newStory.save();

        // Delete the local file after successful upload
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });

        res.status(201).json({ message: "Story created successfully!", story: newStory });
    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all stories for a specific user
const getStoriesByUser = async (req, res) => {
    try {
        const { sellerId } = req.params;
        
        const stories = await Stories.find({ seller: sellerId }).populate("seller");
        
        if (stories.length === 0) {
            return res.status(404).json({ message: "No stories found for this user." });
        }

        res.status(200).json(stories);
    } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a story
const deleteStories = async (req, res) => {
    try {
        const { storyId } = req.params;
  console.log("story id is",storyId );
        // Find the story in the database
        const story = await Stories.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: "Story not found!" });
        }

        // Extract public_id from Cloudinary URL
        const publicId = story.media.split('/').slice(-2).join('/').split('.')[0];

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
         await Stories.findByIdAndDelete(storyId);
        
         res.status(200).json({ 
             message: "Post deleted successfully!",
             storyId:storyId
         });
 
     } catch (error) {
         console.error("Error deleting post:", error);
         res.status(500).json({ 
             message: "Failed to delete post",
             error: error.message 
         });
};
}

module.exports = { createStories, getStoriesByUser, deleteStories };
