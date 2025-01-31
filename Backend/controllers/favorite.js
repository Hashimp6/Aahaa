const Favorite = require("../models/Favorite");

const toggleFavorite = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const userId = req.user.id;

    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      // If no favorites exist, create a new one
      favorite = new Favorite({ userId, sellerIds: [sellerId] });
    } else {
      const index = favorite.sellerIds.indexOf(sellerId);
      if (index === -1) {
        favorite.sellerIds.push(sellerId); // Add favorite
      } else {
        favorite.sellerIds.splice(index, 1); // Remove favorite
      }
    }

    await favorite.save();
    res.json({ success: true, favoriteSellers: favorite.sellerIds });
  } catch (error) {
    res.status(500).json({ message: "Error toggling favorite", error: error.message });
  }
};
const getFavorites = async (req, res) => {
    try {
      const userId = req.user.id;
      const favorite = await Favorite.findOne({ userId }).populate("sellerIds");
  
      res.json({ sellers: favorite ? favorite.sellerIds : [] });
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites", error: error.message });
    }
  };
module.exports={toggleFavorite,getFavorites}  