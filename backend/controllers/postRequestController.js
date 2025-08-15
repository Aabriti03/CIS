// backend/controllers/postRequestController.js
const PostRequest = require('../models/PostRequest');
const User = require('../models/User');
const mongoose = require('mongoose');

// Customer: create a new post request (optionally targeted to a worker)
exports.createPostRequest = async (req, res, next) => {
  try {
    const customerId = req.user?._id;
    const { category, description, workerId = null } = req.body;

    if (!customerId) return res.status(401).json({ message: 'Unauthorized' });
    if (!category || !description) {
      return res.status(400).json({ message: 'Category and description are required.' });
    }

    const payload = { customerId, category, description, status: 'pending' };

    // allow direct request to a specific worker if valid
    if (workerId && mongoose.Types.ObjectId.isValid(workerId)) {
      payload.workerId = workerId;
    } else {
      payload.workerId = null;
    }

    const savedRequest = await PostRequest.create(payload);
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating post request:', error);
    next ? next(error) : res.status(500).json({ message: 'Server error' });
  }
};

// Customer: get all requests by logged-in customer
exports.getCustomerRequests = async (req, res, next) => {
  try {
    const customerId = req.user?._id;
    if (!customerId) return res.status(401).json({ message: 'Unauthorized' });

    const requests = await PostRequest.find({ customerId })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching post requests:', error);
    next ? next(error) : res.status(500).json({ message: 'Server error' });
  }
};

// Worker: get pending requests that match worker's category OR are directly assigned
exports.getRequestsForWorkerCategory = async (req, res, next) => {
  try {
    const workerId = req.user?._id;
    if (!workerId) return res.status(401).json({ message: 'Unauthorized' });

    const worker = await User.findById(workerId).lean();
    if (!worker || worker.role !== 'worker') {
      return res.status(403).json({ message: 'You are not authorized or your category is missing.' });
    }
    if (!worker.category) {
      return res.status(400).json({ message: 'Worker category not found.' });
    }

    const requests = await PostRequest.find({
      $or: [
        { category: worker.category, status: 'pending' },
        { workerId: workerId, status: 'pending' }, // directly targeted to this worker
      ],
    })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests for worker:', error);
    next ? next(error) : res.status(500).json({ message: 'Server error' });
  }
};

// Worker: accept/reject a request (param :id)
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const workerId = req.user?._id;
    const { id } = req.params;
    const { status } = req.body; // "accepted" or "rejected"

    if (!workerId) return res.status(401).json({ message: 'Unauthorized' });

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'accepted' or 'rejected'." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid request id.' });
    }

    const request = await PostRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Only pending requests can be updated
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request status cannot be updated.' });
    }

    // Assign workerId and update status
    request.workerId = workerId;
    request.status = status;
    await request.save();

    res.json({ message: `Request ${status} successfully.`, request });
  } catch (error) {
    console.error('Error updating request status:', error);
    next ? next(error) : res.status(500).json({ message: 'Server error' });
  }
};

// Worker: get accepted requests assigned to logged-in worker (history)
exports.getAcceptedRequestsForWorker = async (req, res, next) => {
  try {
    const workerId = req.user?._id;
    if (!workerId) return res.status(401).json({ message: 'Unauthorized' });

    const requests = await PostRequest.find({ workerId, status: 'accepted' })
      .sort({ updatedAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching accepted requests:', error);
    next ? next(error) : res.status(500).json({ message: 'Server error' });
  }
};
