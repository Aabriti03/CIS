const express = require('express');
const router = express.Router();

// Import controller functions
const authController = require('../controllers/authController');

// Import middleware to protect routes
const authMiddleware = require('../middleware/authMiddleware');

// Route: Register a new user
router.post('/register', authController.registerUser);

// Route: Login an existing user
router.post('/login', authController.loginUser);

// Route: Get user profile (Protected)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
