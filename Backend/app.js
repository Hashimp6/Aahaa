const express = require('express');
const authRouter = require('./routes/auth');
const sellerRoutes = require('./routes/sellers');


const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use('/api/auth', authRouter);
app.use('/api/sellers', sellerRoutes);


module.exports = app;
