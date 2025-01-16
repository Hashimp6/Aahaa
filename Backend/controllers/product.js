
const Product = require('../models/Product');
const cloudinary = require("../configs/cloudinary");
const fs = require("fs");

  // Add a new product
 const createProduct= async (req, res) => {
  try {
    const { productName, description, price, quantity, stars } = req.body;
    const sellerId = req.params.sellerId;

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new product
    const product = new Product({
      seller: sellerId,
      productName,
      description,
      price,
      quantity,
      stars,
      productImage: result.secure_url
    });

    // Save product to database
    await product.save();

    // Delete the local file after successful upload to cloudinary
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting local file:', err);
    });

    res.status(201).json(product);
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};


  // Get all products
 const getAllProducts= async (req, res) => {
    try {
      const products = await Product.find()
        .populate('seller', 'companyName');
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get seller's products
  const getSellerProducts= async (req, res) => {
    try {
      const products = await Product.find({ seller: req.params.sellerId });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get single product
  const getProductById= async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('seller', 'companyName');
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update a product
  const updateProduct= async (req, res) => {
    try {
      const { productName, description, price, quantity, stars } = req.body;
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if new image is uploaded
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        product.productImage = result.secure_url;
      }

      product.productName = productName || product.productName;
      product.description = description || product.description;
      product.price = price || product.price;
      product.quantity = quantity || product.quantity;
      if (stars !== undefined) product.stars = stars;
      product.updatedAt = Date.now();

      await product.save();
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete a product
  const deleteProduct= async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update product stars
  
module.exports={createProduct,getAllProducts,deleteProduct,getSellerProducts, updateProduct,getProductById}

