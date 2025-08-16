// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getProfile,
} = require('../controllers/authController');

// Public
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private
router.get('/profile', auth, getProfile);

module.exports = router;
