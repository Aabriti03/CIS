const express = require('express');
const router = express.Router();

// ✅ Fixed case-sensitive import
const authMiddleware = require('../middleware/authMiddleware');

const {
  createPostRequest,
  getPostRequestsByCustomer,
  getRequestsForWorkerCategory,
  getAcceptedRequestsForWorker, // ✅ added this controller
  updateRequestStatus,
} = require('../controllers/postRequestController');

// Create a new post request
router.post('/', authMiddleware, createPostRequest);

// Get post requests for the logged-in customer
router.get('/', authMiddleware, getPostRequestsByCustomer);

// Get requests for a worker's category
router.get('/worker', authMiddleware, getRequestsForWorkerCategory);

// ✅ Get accepted requests for the logged-in worker (for Worker History page)
router.get('/worker/accepted', authMiddleware, getAcceptedRequestsForWorker);

// Update request status (accept/decline)
router.put('/:requestId/status', authMiddleware, updateRequestStatus);

module.exports = router;
