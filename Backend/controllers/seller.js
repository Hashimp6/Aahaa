const Seller = require("../models/Seller"); // Adjust path to your Seller model
const User = require("../models/User"); // Adjust path to your User model

// Register as a seller
const registerSeller = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from the URL parameter
    const { companyName, description, category, profile, location, contact } =
      req.body;

    // Validate required fields
    if (!companyName || !location || !location.coordinates) {
      return res.status(400).json({
        message:
          "Company name, address, and location coordinates are required.",
      });
    }

    // Find the user who wants to become a seller
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is already a seller
    if (user.sellerDetails) {
      return res.status(400).json({ message: "User is already a seller." });
    }

    // Create the new seller record
    const newSeller = new Seller({
      companyName,
      description,
      category,
      profile,
      location,
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
    console.error(error);
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
    const { userId } = req.params;
    const { companyName, description, category, profile, location, contact } =
      req.body;

    const seller = await Seller.findById(userId);
    if (!seller) return res.status(404).json({ message: "Seller not found." });

    // Update fields if provided
    if (companyName) seller.companyName = companyName;
    if (description) seller.description = description;
    if (category) seller.category = category;
    if (profile) seller.profile = profile;
    if (location) seller.location = location;
    if (contact) seller.contact = contact;

    await seller.save();
    res
      .status(200)
      .json({ message: "Seller details updated successfully.", seller });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
    res
      .status(500)
      .json({
        message: "Server error. Please try again later.",
        error: error.message,
      });
  }
};


const deleteSeller = async (req, res) => {
    try {
      const { sellerId } = req.params;  // Extract the seller ID from the URL parameter
      
      // Find and delete the seller by ID
      const seller = await Seller.findByIdAndDelete(sellerId);
      
      if (!seller) {
        // If no seller is found with the provided ID, send a 404 error
        return res.status(404).json({ message: 'Seller not found.' });
      }
      
      // Send a success response after deletion
      res.status(200).json({ message: 'Seller deleted successfully.' });
      
    } catch (error) {
      // Handle any errors that occur
      res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
    }
  };
module.exports = {
  registerSeller,
  getAllSellers,
  updateSellerDetails,
  getSellerById,
  deleteSeller
};
