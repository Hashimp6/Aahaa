const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendMail = require("../configs/nodeMailer");

// Temporary storage for registration data and OTPs
let registrationStorage = {};
let otpStorage = {};

// Initial registration step
const initiateRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email, and password are required." 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "Email is already registered." 
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store registration data temporarily
    registrationStorage[email] = {
      name,
      email,
      password: hashedPassword,
      timestamp: Date.now()
    };

    // Generate and send OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStorage[email] = {
      otp,
      timestamp: Date.now()
    };

    // Send OTP email
    await sendMail(email, otp);

    res.status(200).json({ 
      message: "OTP sent successfully. Please verify to complete registration." 
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message
    });
  }
};

// Verify OTP and complete registration
const verifyOTPAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP exists and is valid
    if (!otpStorage[email] || !registrationStorage[email]) {
      return res.status(400).json({ 
        message: "OTP expired or registration timeout. Please try again." 
      });
    }

    // Verify OTP
    if (otpStorage[email].otp !== otp) {
      return res.status(400).json({ 
        message: "Invalid OTP." 
      });
    }

    // Get stored registration data
    const userData = registrationStorage[email];

    // Create new user in database
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isVerified: true
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    // Clean up storage
    delete otpStorage[email];
    delete registrationStorage[email];

    res.status(201).json({
      message: "Registration completed successfully.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isVerified: newUser.isVerified
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!registrationStorage[email]) {
      return res.status(400).json({ 
        message: "Registration session expired. Please start registration again." 
      });
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStorage[email] = {
      otp,
      timestamp: Date.now()
    };

    // Send new OTP
    await sendMail(email, otp);

    res.status(200).json({ 
      message: "OTP resent successfully." 
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message
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
    console.log("data for update ", phone, address, coordinates);
    let updatedCoordinates = coordinates;
    if (coordinates && coordinates.lat && coordinates.lng) {
      updatedCoordinates = [coordinates.lng, coordinates.lat]; // Convert to [longitude, latitude]
    }
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the provided fields
    if (phone) user.contact.phone = phone;
    if (address) user.contact.address = address;
    if (coordinates) user.location.coordinates = updatedCoordinates;

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
    const { id } = req.params; // Extract the seller ID from the URL parameter

    // Find and delete the seller by ID
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      // If no seller is found with the provided ID, send a 404 error
      return res.status(404).json({ message: "User not found." });
    }

    // Send a success response after deletion
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    // Handle any errors that occur
    res
      .status(500)
      .json({
        message: "Server error. Please try again later.",
        error: error.message,
      });
  }
};
const verifyToken= async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    console.log("token is ",token);
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded is ",decoded);
    // Find user (assuming you have a User model)
    const user = await User.findById(decoded.id);
    console.log("user is ",user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    

    res.json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = {
  initiateRegistration,
  verifyOTPAndRegister,
  resendOTP,
  login,
  getAllUsers,
  updateUserDetails,
  deleteUser,
  verifyToken
};
