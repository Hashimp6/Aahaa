const Seller = require("../models/Seller");

// Get nearest sellers by location
const getNearestSellers = async (req, res) => {
  try {
    console.log("Started fetching nearest sellers...");

    const { latitude, longitude, page = 1, limit = 50 } = req.query;

    // Ensure latitude and longitude are provided
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    console.log("Received location:", latitude, longitude);

    // Build the query for location-based search
    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $minDistance: 0,     // Optional: starts from the exact point
        },
      },
    };

    // Fields to select (improves performance)
    const projection = {
      companyName: 1,
      profileImage: 1,
      category: 1,
      contact:1,
      place: 1,
      location: 1,
      badge: 1,
      verified: 1,
    };

    // Fetch the nearest sellers
    const sellers = await Seller.find(query)
      .select(projection)
      .skip((page - 1) * limit)  // Pagination
      .limit(limit);

    console.log(`Found ${sellers.length} sellers.`);

    res.status(200).json({
      sellers,
      pagination: {
        currentPage: parseInt(page),
        hasMore: sellers.length === limit,
      },
    });
  } catch (error) {
    console.error("Error in getNearestSellers:", error);
    res.status(500).json({
      message: "Error fetching nearest sellers.",
      error: error.message,
    });
  }
};
// Get nearest sellers by location with category filter
const getSellersByCategory = async (req, res) => {
  try {
    console.log("querry is ",req.query);
    const { latitude, longitude, category, } = req.query;

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
const searchSellers = async (req, res) => {
  try {
    const { searchTerm, latitude, longitude } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required." });
    }

    // Create base query for location if provided
    let locationQuery = {};
    if (latitude && longitude) {
      locationQuery = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
          },
        },
      };
    }

    // Create regex pattern for case-insensitive partial matches
    const searchRegex = new RegExp(searchTerm, 'i');

    // First try to find exact matches in company name
    const exactMatches = await Seller.find({
      ...locationQuery,
      companyName: new RegExp(`^${searchTerm}$`, 'i')
    }).limit(50);

    // If exact matches exist, return them
    if (exactMatches.length > 0) {
      return res.status(200).json({
        sellers: exactMatches,
        matchType: 'exact'
      });
    }

    // If no exact matches, search for similar matches in company name and description
    const similarMatches = await Seller.find({
      ...locationQuery,
      companyName: searchRegex, // Only searching in companyName
    }).limit(20);

    res.status(200).json({
      sellers: similarMatches,
      matchType: 'similar'
    });

  } catch (error) {
    res.status(500).json({
      message: "Error searching sellers.",
      error: error.message,
    });
  }
};

module.exports = {
  getNearestSellers,
  getSellersByCategory,
  searchSellers
};