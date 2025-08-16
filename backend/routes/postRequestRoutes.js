// backend/routes/postRequestRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const {
  createPostRequest,
  getCustomerRequests,
  getRequestsForWorkerCategory,
  acceptRequest,
  getAcceptedRequestsForWorker,
} = require('../controllers/postRequestController');

// Customer: create a new service request (optionally targeted to a worker)
router.post('/', auth, createPostRequest);

// Customer: view my own requests (post history)
router.get('/customer', auth, getCustomerRequests);

// Worker: feed (pending requests in my category or assigned to me)
router.get('/worker', auth, getRequestsForWorkerCategory);

// Worker: accept a specific request
router.patch('/:id/accept', auth, acceptRequest);

// Worker: my accepted requests (request history)
router.get('/accepted', auth, getAcceptedRequestsForWorker);

module.exports = router;
