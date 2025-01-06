// controllers/favoriteController.js
const User = require('../models/User');
const Seller = require('../models/Seller');

// ➡️ Add a seller to favorites
const addFavoriteSeller = async (req, res) => {
    const { userId, sellerId } = req.body;

    try {
        console.log("reached");
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.favorites.includes(sellerId)) {
            user.favorites.push(sellerId);
            await user.save();
            return res.status(200).json({ message: 'Seller added to favorites' });
        } else {
            return res.status(400).json({ message: 'Seller already in favorites' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding favorite', error });
    }
};

// ➡️ Remove a seller from favorites
const removeFavoriteSeller = async (req, res) => {
    const { userId, sellerId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.favorites = user.favorites.filter(id => id.toString() !== sellerId);
        await user.save();
        res.status(200).json({ message: 'Seller removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error });
    }
};

// ➡️ Fetch all favorite sellers for a user
const getFavoriteSellers = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('favorites');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
};

module.exports = { addFavoriteSeller, removeFavoriteSeller, getFavoriteSellers };
