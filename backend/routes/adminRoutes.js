const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roles');

// Models used for admin operations
const User = require('../models/User');
const PostRequest = require('../models/PostRequest');

// Example admin health check (no auth)
router.get('/health', (req, res) => res.json({ ok: true, scope: 'admin' }));

// ✅ Protect admin routes: token check -> role check
router.get('/stats', auth, requireRole('admin'), (req, res) => {
  res.json({
    message: 'Admin stats',
    user: { id: req.user._id, role: req.user.role }
  });
});

/**
 * Admin: list all customers (no passwords)
 */
router.get('/customers', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-passwordHash -__v')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    next ? next(err) : res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin: view worker profiles by category (no passwords)
 * Expects one of: babysitting|electric|gardening|household|plumbing
 */
router.get('/workers/by-category/:category', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const category = req.params.category;
    const workers = await User.find({ role: 'worker', category })
      .select('-passwordHash -__v')
      .sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) {
    next ? next(err) : res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin: recent activities (derived, no Activity model required)
 * Returns a unified list combining user registrations and request updates.
 */
router.get('/recent-activities', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const latestUsers = await User.find({})
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const latestRequests = await PostRequest.find({})
      .select('category description status customerId workerId createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    const activities = [
      ...latestUsers.map(u => ({
        _id: `u_${u._id}`,
        type: 'user.registered',
        at: u.createdAt,
        actorId: u._id,
        role: u.role,
        name: u.name,
        email: u.email
      })),
      ...latestRequests.map(r => ({
        _id: `r_${r._id}`,
        type: `request.${r.status}`,
        at: r.updatedAt || r.createdAt,
        requestId: r._id,
        category: r.category,
        customerId: r.customerId,
        workerId: r.workerId || null,
        description: r.description
      }))
    ]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 200);

    res.json(activities);
  } catch (err) {
    next ? next(err) : res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
