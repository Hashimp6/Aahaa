const express = require('express');
const authRouter = require('./routes/auth');
const sellerRoutes = require('./routes/sellers');
const searchRoutes = require('./routes/search');
const categoryRouter = require('./routes/category');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use('/api/auth', authRouter);
app.use('/api/sellers', sellerRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/category', categoryRouter);



module.exports = app;
