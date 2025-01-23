const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./configs/db");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();


const app = require("./app"); // Import app configuration

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
