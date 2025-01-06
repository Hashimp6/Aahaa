const express = require("express");
const productRouter = express.Router();
const {
  getAllProducts,
  createProduct,
  getSellerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const upload = require("../configs/multer");

// Product routes
productRouter.post(
  "/add/:sellerId",
  upload.single("productImage"),
  createProduct
);
productRouter.get("/all", getAllProducts);
productRouter.get("/seller/:sellerId", getSellerProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", upload.single("productImage"), updateProduct);
productRouter.delete("/:id", deleteProduct);

module.exports = productRouter;
