const Favorite = require("../models/Favorites");

const toggleFavorite = async (req, res) => {
  try {
    const { sellerId, userId } = req.body; // Extract userId from request body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      // If user has no favorites, create new entry
      favorite = new Favorite({ userId, sellerIds: [sellerId] });
    } else {
      if (favorite.sellerIds.includes(sellerId)) {
        // Remove seller if already in favorites
        favorite.sellerIds = favorite.sellerIds.filter(id => id.toString() !== sellerId);
      } else {
        // Add seller to favorites
        favorite.sellerIds.push(sellerId);
      }
    }

    await favorite.save();

    // Fetch updated favorite sellers
    const updatedFavorites = await Favorite.findOne({ userId }).populate("sellerIds");

    res.json({ success: true, favoriteSellers: updatedFavorites.sellerIds });
  } catch (error) {
    res.status(500).json({ message: "Error toggling favorite", error: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query params

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const favorite = await Favorite.findOne({ userId }).populate("sellerIds");

    res.json({ sellers: favorite ? favorite.sellerIds : [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error: error.message });
  }
};

module.exports = { toggleFavorite, getFavorites };
