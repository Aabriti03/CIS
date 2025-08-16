// backend/controllers/postRequestController.js
const PostRequest = require('../models/PostRequest');
const User = require('../models/User');

/**
 * POST /api/postrequests
 * Body: { category, description, workerId? }
 * - Customer creates a service request (optionally targeting a specific worker).
 * - Default status: 'pending'
 */
exports.createPostRequest = async (req, res) => {
  try {
    const customerId = req.user?._id;
    if (!customerId) return res.status(401).json({ message: 'Unauthorized' });

    const { category, description, workerId } = req.body;

    if (!category || !description?.trim()) {
      return res.status(400).json({ message: 'Category and description are required' });
    }

    const valid = ['electric', 'babysitting', 'gardening', 'househelp', 'plumbing'];
    const incomingCategory = String(category).toLowerCase();
    if (!valid.includes(incomingCategory)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let assignedWorkerId = null;
    if (workerId) {
      const worker = await User.findById(workerId).select('_id role category');
      if (!worker || worker.role !== 'worker') {
        return res.status(400).json({ message: 'Invalid worker' });
      }
      assignedWorkerId = worker._id;
    }

    // ✅ Minimal necessary change: store normalized (lowercased) category
    const doc = await PostRequest.create({
      customerId,
      workerId: assignedWorkerId,
      category: incomingCategory,
      description: description.trim(),
      status: 'pending',
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error('createPostRequest error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/postrequests/customer
 * - Customer post history: all requests created by me
 */
exports.getCustomerRequests = async (req, res) => {
  try {
    const customerId = req.user?._id;
    if (!customerId) return res.status(401).json({ message: 'Unauthorized' });

    const rows = await PostRequest.find({ customerId })
      .sort({ createdAt: -1 });

    return res.json(rows);
  } catch (err) {
    console.error('getCustomerRequests error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/postrequests/worker
 * - Worker feed (Home): show pending requests that are:
 *   1) Unassigned AND match my category, OR
 *   2) Explicitly assigned to me and still pending
 * - Populates customer info so UI can display who requested it.
 */
exports.getRequestsForWorkerCategory = async (req, res) => {
  try {
    const workerId = req.user?._id;
    if (!workerId) return res.status(401).json({ message: 'Unauthorized' });

    const worker = await User.findById(workerId).select('_id role category');
    if (!worker || worker.role !== 'worker') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // ✅ Minimal necessary change: normalize worker category for matching
    const workerCategory = String(worker.category || '').toLowerCase();

    const query = {
      status: 'pending',
      $or: [
        { workerId: null, category: workerCategory },
        { workerId: workerId },
      ],
    };

    const requests = await PostRequest.find(query)
      .sort({ createdAt: -1 })
      .populate('customerId', 'name email phone');

    // Keep the previous shape; add a 'customer' helper for the UI
    const shaped = requests.map((r) => ({
      _id: r._id,
      category: r.category,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      workerId: r.workerId,
      customerId: r.customerId?._id ?? null,
      customer: r.customerId
        ? {
            _id: r.customerId._id,
            name: r.customerId.name,
            email: r.customerId.email,
            phone: r.customerId.phone,
          }
        : null,
    }));

    return res.json(shaped);
  } catch (err) {
    console.error('getRequestsForWorkerCategory error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PATCH /api/postrequests/:id/accept
 * - Worker accepts a request (only if it is pending and either targeted to them or unassigned in their category)
 */
exports.acceptRequest = async (req, res) => {
  try {
    const workerId = req.user?._id;
    if (!workerId) return res.status(401).json({ message: 'Unauthorized' });

    const worker = await User.findById(workerId).select('_id role category');
    if (!worker || worker.role !== 'worker') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.params;
    const pr = await PostRequest.findById(id);
    if (!pr) return res.status(404).json({ message: 'Request not found' });
    if (pr.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    // ✅ Normalize worker.category for the category match check
    const workerCategory = String(worker.category || '').toLowerCase();

    // Accept if:
    // - unassigned AND category matches worker, OR
    // - assigned to this worker
    const canAccept =
      (!pr.workerId && pr.category === workerCategory) ||
      String(pr.workerId) === String(workerId);

    if (!canAccept) {
      return res.status(403).json({ message: 'You cannot accept this request' });
    }

    pr.workerId = workerId;
    pr.status = 'accepted';
    await pr.save();

    return res.json(pr);
  } catch (err) {
    console.error('acceptRequest error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/postrequests/accepted
 * - Worker request history: requests this worker has accepted
 */
exports.getAcceptedRequestsForWorker = async (req, res) => {
  try {
    const workerId = req.user?._id;
    if (!workerId) return res.status(401).json({ message: 'Unauthorized' });

    const rows = await PostRequest.find({
      workerId,
      status: 'accepted',
    }).sort({ updatedAt: -1 });

    return res.json(rows);
  } catch (err) {
    console.error('getAcceptedRequestsForWorker error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
