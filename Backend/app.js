const express = require('express');
const cors = require("cors");
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
app.use(cors({
    origin: '*',
    credentials: true,
  }));
  
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);
app.use('/sellers', sellerRoutes);
app.use('/search', searchRoutes);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/favorite', favRouter);
app.use('/post', postRouter);
app.use('/stories', storiesRouter);


module.exports = app;
