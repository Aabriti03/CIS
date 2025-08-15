const PostRequest = require('../models/PostRequest');
const User = require('../models/User');

// Create a new post request (for customers)
exports.createPostRequest = async (req, res) => {
  try {
    const { category, description, workerId } = req.body;
    const customerId = req.user._id;

    if (!category || !description) {
      return res.status(400).json({ message: 'Category and description are required.' });
    }

    const newRequest = new PostRequest({
      customerId,
      category,
      description,
      status: 'pending',
      workerId: workerId || null,
    });


    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating post request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all post requests by the logged-in customer
exports.getPostRequestsByCustomer = async (req, res) => {
  try {
    const customerId = req.user._id;
    const requests = await PostRequest.find({ customerId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching post requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all pending requests matching the logged-in worker's category
exports.getRequestsForWorkerCategory = async (req, res) => {
  try {
    const workerId = req.user._id;
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== 'worker') {
      return res.status(403).json({ message: 'You are not authorized or your category is missing.' });
    }

    const category = worker.category;
    if (!category) {
      return res.status(400).json({ message: 'Worker category not found.' });
    }

    const requests = await PostRequest.find({ category, status: 'pending' }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests for worker:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the status of a request (accept/decline)
exports.updateRequestStatus = async (req, res) => {
  try {
    const workerId = req.user._id;
    const { requestId } = req.params;
    const { status } = req.body; // Expected to be "accepted" or "declined"

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const request = await PostRequest.findById(requestId);
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
    res.status(500).json({ message: 'Server error' });
  }
};

// Get accepted requests assigned to logged-in worker (for request history)
exports.getAcceptedRequestsForWorker = async (req, res) => {
  try {
    const workerId = req.user._id;
    const requests = await PostRequest.find({ workerId, status: 'accepted' }).sort({ updatedAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching accepted requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
