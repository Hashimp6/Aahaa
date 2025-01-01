const express = require('express');
const { register, login, getAllUsers, updateUserDetails, deleteUser } = require('../controllers/auth');

const authRouter = express.Router();

// Register a new user
authRouter.post('/register', register);

// Login a user
authRouter.post('/login', login);

// Get all users
authRouter.get('/users', getAllUsers);

// Update user details (partial updates for different stages)
authRouter.patch('/user/:userId', updateUserDetails);

authRouter.delete('/:id', deleteUser);
module.exports = authRouter;
