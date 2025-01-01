const Category = require("../models/Category");
const cloudinary = require("../configs/cloudinary");
const fs = require("fs");

// Utility function to upload an image to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    console.log("Attempting to upload to Cloudinary..."); // Log to confirm it's running
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "categories", // Folder name on Cloudinary
      resource_type: "auto", // Automatically detect the file type (e.g., image, video)
    });
    console.log("Cloudinary upload result:", result); // Log the result to check if upload was successful
    return result.secure_url;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error); // Log detailed error
    throw new Error("Failed to upload image to Cloudinary");
  } finally {
    console.log("Deleting local file:", filePath);
    fs.unlinkSync(filePath); // Clean up the local file after uploading
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Logs name and colorCode
    console.log("Uploaded File:", req.file); // Logs file details

    const { name, colorCode } = req.body;

    if (!name || !colorCode || !req.file) {
      return res
        .status(400)
        .json({ message: "Name, image, and color code are required." });
    }
   
    // Check for duplicate category name
    // const existingCategory = await Category.findOne({ name });
    // if (existingCategory) {
    //   return res
    //     .status(400)
    //     .json({ message: "Category with the same name already exists." });
    // }
    console.log("image url befor");
    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.path);
    console.log("image url", imageUrl);

    const category = new Category({ name, image: imageUrl, colorCode });
    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully!", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(500)
      .json({ message: error.message || "Error creating category." });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, colorCode } = req.body;

    // Find the category to update
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Check for duplicate category name if name is being updated
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category with the same name already exists." });
      }
      category.name = name;
    }

    if (colorCode) {
      category.colorCode = colorCode;
    }

    // Update image if a new file is uploaded
    if (req.file) {
      category.image = await uploadToCloudinary(req.file.path);
    }

    await category.save();

    res
      .status(200)
      .json({ message: "Category updated successfully!", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error updating category." });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error deleting category." });
  }
};
// Get all categories
const getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find(); // Fetch all categories from the database
  
      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: "No categories found." });
      }
  
      res.status(200).json({ message: "Categories fetched successfully!", categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: error.message || "Error fetching categories." });
    }
  };
  

module.exports = { deleteCategory, updateCategory, createCategory,getAllCategories };
