const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController'); // import all controller methods
const { getProfile } = require('../controllers/authController');

// Search workers by name or category
router.get('/search', userController.searchWorkers);

// Route to get logged-in user's profile (Protected)
router.get('/profile', authMiddleware, getProfile);

// Route to get workers by category (public)
router.get('/workers/:category', userController.getWorkersByCategory);

// ✅ NEW: Get single worker by ID (public)
router.get('/workers/id/:id', userController.getWorkerById);

module.exports = router;
