const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const connectDB = require('./configs/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = require('./app'); // Import app configuration

// Enable CORS for all origins (you can also specify origins here)
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow methods
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
