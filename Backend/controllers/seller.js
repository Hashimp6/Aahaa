const Seller = require("../models/Seller");
const User = require("../models/User");
const cloudinary = require("../configs/cloudinary");
const fs = require("fs").promises; // Import fs.promises for async file operations

const registerSeller = async (req, res) => {
  try {
    console.log("Received form data:", {
      body: req.body,
      file: req.file
        ? {
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
          }
        : "No file uploaded",
      params: req.params,
    });

    const { userId } = req.params;

    // Parse stringified JSON fields with error handling
    let coordinates, contact;
    try {
      coordinates = JSON.parse(req.body.coordinates);
      contact = JSON.parse(req.body.contact);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid JSON format for coordinates or contact",
        error: error.message,
      });
    }

    const { companyName, description, category, location } = req.body;

    // Validate required fields
    if (
      !companyName ||
      !location ||
      !coordinates ||
      !coordinates.lat ||
      !coordinates.lng
    ) {
      return res.status(400).json({
        message:
          "Company name, location address, and location coordinates are required.",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is already a seller
    if (user.sellerDetails) {
      return res
        .status(400)
        .json({ message: "User is already registered as a seller." });
    }

    // Handle the profile image upload
    let profileImageURL = "";
    if (req.file) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "seller_images",
          transformation: [{ width: 300, height: 300, crop: "limit" }],
        });
        profileImageURL = result.secure_url;

        // Clean up the local file after successful upload to Cloudinary
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting local file:", unlinkError);
          // Continue execution even if file deletion fails
        }
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        // Try to clean up the file even if upload failed
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting local file:", unlinkError);
        }
        return res.status(500).json({
          message: "Error uploading image",
          error: uploadError.message,
        });
      }
    }

    // Create a new seller record
    const newSeller = new Seller({
      companyName,
      description,
      category,
      profileImage: profileImageURL,
      location: {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat], // Store as [longitude, latitude]
      },
      contact,
    });

    // Save the seller to the database
    const savedSeller = await newSeller.save();

    // Link the seller record to the user
    user.sellerDetails = savedSeller._id;
    await user.save();

    res.status(201).json({
      message: "Seller registered successfully.",
      seller: savedSeller,
    });
  } catch (error) {
    console.error("Error while registering seller:", error);
    // If there's a file and an error occurred, try to clean it up
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting local file:", unlinkError);
      }
    }
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};
const getAllSellers = async (req, res) => {
  try {
    // Find all users with a non-null sellerDetails field
    const sellers = await User.find({ sellerDetails: { $ne: null } }).populate(
      "sellerDetails"
    );
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSellerDetails = async (req, res) => {
  try {
    const {sellerId } = req.params;
    const { companyName, description, category, location, coordinates, contact } = req.body;
    // Parse stringified JSON fields with error handling
    let  parsedContact;
    try {
      parsedContact = JSON.parse(contact);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid JSON format for coordinates or contact",
        error: error.message,
      });
    }

    // Validate required fields
    if (!companyName  ) {
      return res.status(400).json({
        message: "Company name are required.",
      });
    }

    // Check if the user exists
    const seller = await Seller.findById(sellerId);
    console.log("seller is ",seller);
    if (!seller) {
      return res.status(404).json({ message: "User not found." });
    }

   

    // Handle profile image upload if it exists in the request
    let profileImageURL = Seller.profileImage; // Default to current image
    if (req.file) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "seller_images",
          transformation: [{ width: 300, height: 300, crop: "limit" }],
        });
        profileImageURL = result.secure_url;

        // Clean up the local file after successful upload to Cloudinary
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting local file:", unlinkError);
          // Continue execution even if file deletion fails
        }
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        // Try to clean up the file even if upload failed
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting local file:", unlinkError);
        }
        return res.status(500).json({
          message: "Error uploading image",
          error: uploadError.message,
        });
      }
    }

    // Update seller details in the database
    const updatedSeller = await Seller.findOneAndUpdate(
      {  _id: sellerId }, 
      {
        companyName,
        description,
        category,
        profileImage: profileImageURL,
      },
      { new: true } // Return the updated seller document
    );
    console.log("Updated seller",updatedSeller);

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found or could not be updated." });
    }

    // Return the updated seller data
    return res.status(200).json({
      message: "Seller details updated successfully.",
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("Error updating seller details:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


const getSellerById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("user id ", userId); // Extract the seller ID from the URL parameter

    // Find the seller by ID
    const seller = await Seller.findById(userId);

    if (!seller) {
      // If no seller is found with the provided ID, send a 404 error
      return res.status(404).json({ message: "Seller not found." });
    }

    // Send the seller data as a response
    res.status(200).json(seller);
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const deleteSeller = async (req, res) => {
  try {
    const { sellerId } = req.params; // Extract the seller ID from the URL parameter

    // Find and delete the seller by ID
    const seller = await Seller.findByIdAndDelete(sellerId);

    if (!seller) {
      // If no seller is found with the provided ID, send a 404 error
      return res.status(404).json({ message: "Seller not found." });
    }

    // Send a success response after deletion
    res.status(200).json({ message: "Seller deleted successfully." });
  } catch (error) {
    // Handle any errors that occur
    res
      .status(500)
      .json({
        message: "Server error. Please try again later.",
        error: error.message,
      });
  }
};
module.exports = {
  registerSeller,
  getAllSellers,
  updateSellerDetails,
  getSellerById,
  deleteSeller,
};
