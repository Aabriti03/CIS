// backend/routes/postRequestRoutes.js
const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roles');

const {
  createPostRequest,
  getCustomerRequests,
  getRequestsForWorkerCategory,
  updateRequestStatus,
  getAcceptedRequestsForWorker,
} = require('../controllers/postRequestController');

// Customer creates a request
router.post('/', auth, requireRole('customer'), createPostRequest);

// Customer: get my requests
router.get('/customer', auth, requireRole('customer'), getCustomerRequests);

// Worker: available/pending requests (unassigned in my category OR pending assigned to me)
router.get('/worker', auth, requireRole('worker'), getRequestsForWorkerCategory);

// Worker: accept/reject a request
router.put('/:id/status', auth, requireRole('worker'), updateRequestStatus);

// Worker: my accepted requests (HISTORY)  🔧 this is the route your UI needs
router.get('/accepted', auth, requireRole('worker'), getAcceptedRequestsForWorker);

module.exports = router;
