const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the path to your User model

// Register a new user with basic details
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate a JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful.", token, user });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords from the response
    res.status(200).json({ message: "Users fetched successfully.", users });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Update user details at different stages
const updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { phone, address, coordinates } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the provided fields
    if (phone) user.contact.phone = phone;
    if (address) user.contact.address = address;
    if (coordinates) user.location.coordinates = coordinates;

    await user.save();

    res
      .status(200)
      .json({ message: "User details updated successfully.", user });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;  // Extract the seller ID from the URL parameter
      
      // Find and delete the seller by ID
      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        // If no seller is found with the provided ID, send a 404 error
        return res.status(404).json({ message: 'User not found.' });
      }
      
      // Send a success response after deletion
      res.status(200).json({ message: 'User deleted successfully.' });
      
    } catch (error) {
      // Handle any errors that occur
      res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
    }
  };

module.exports = { register, login, getAllUsers, updateUserDetails ,deleteUser};
