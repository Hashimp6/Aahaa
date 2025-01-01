const express = require("express");
const categoryRouter = express.Router();
const upload = require("../configs/multer");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/category");

// Route to create a new category (with image upload)
categoryRouter.post("/add", upload.single("image"), createCategory);

// Route to update an existing category (with optional image upload)
categoryRouter.patch("/:id", upload.single("image"), updateCategory);

// Route to delete a category
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.get("/all", getAllCategories);

module.exports =categoryRouter;
