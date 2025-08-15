const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roles');

const {
  createPostRequest,
  getCustomerRequests,
  getRequestsForWorkerCategory,
  updateRequestStatus,
  getAcceptedRequestsForWorker,
} = require('../controllers/postRequestController');

// ✅ Customer can create requests & view own requests
router.post('/', auth, requireRole('customer'), createPostRequest);
router.get('/customer', auth, requireRole('customer'), getCustomerRequests);

// ✅ Worker can view requests for their category
router.get('/worker', auth, requireRole('worker'), getRequestsForWorkerCategory);

// ✅ Worker can view their accepted requests
router.get('/worker/accepted', auth, requireRole('worker'), getAcceptedRequestsForWorker);

// ✅ Worker can update request status
router.put('/:id/status', auth, requireRole('worker'), updateRequestStatus);

module.exports = router;
