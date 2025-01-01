const Seller = require("../models/Seller");

// Get nearest sellers by location
const getNearestSellers = async (req, res) => {
  try {
    console.log("started");
    const { latitude, longitude, page = 1 } = req.query;
    console.log("loc",latitude);

    // Ensure latitude and longitude are provided
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }
console.log("going");
    // Build the base query for location-based search
    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        },
      },
    };

    // Fetch the nearest sellers based on location
    const sellers = await Seller.find(query)
      .skip((page - 1) * 50)  // Skip based on page number and limit
      .limit(50);
console.log("sellers",sellers);

    res.status(200).json({
      sellers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching nearest sellers.",
      error: error.message,
    });
  }
};

// Get nearest sellers by location with category filter
const getSellersByCategory = async (req, res) => {
  try {
    const { latitude, longitude, category, page = 1 } = req.query;

    // Ensure latitude and longitude are provided
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    // Build the base query for location-based search
    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        },
      },
    };

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    // Fetch the nearest sellers based on location and category filter
    const sellers = await Seller.find(query)
      .skip((page - 1) * 50)  // Skip based on page number and limit
      .limit(50);

    res.status(200).json({
      sellers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching sellers by category and location.",
      error: error.message,
    });
  }
};

module.exports = {
  getNearestSellers,
  getSellersByCategory,
};
