const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import CORS
const connectDB = require("./configs/db");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = require("./app"); // Import app configuration

// Enable CORS for all origins (you can also specify origins here)

app.use(cors({
  origin: ['https://aahaa-fronend.vercel.app', 'http://localhost:5173'],  // Update with actual domains
  credentials: true,
}));




// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
