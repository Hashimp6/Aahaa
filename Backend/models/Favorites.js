const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seller" }],
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
