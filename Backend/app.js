const express = require('express');
const authRouter = require('./routes/auth');
const sellerRoutes = require('./routes/sellers');
const searchRoutes = require('./routes/search');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/products');
const favRouter = require('./routes/fav');
const postRouter = require('./routes/post');
const storiesRouter = require('./routes/stories');

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use('/api/auth', authRouter);
app.use('/api/sellers', sellerRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/favorite', favRouter);
app.use('/api/post', postRouter);
app.use('/api/stories', storiesRouter);


module.exports = app;
