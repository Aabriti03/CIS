// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// ✅ Import the main auth middleware and the adminOnly guard from it
const auth = require('../middleware/authMiddleware');
const { adminOnly } = auth;

// Example admin endpoints (keep your existing handlers/controllers)
router.get('/health', (req, res) => res.json({ ok: true, scope: 'admin' }));

// Protect admin routes: first check token (auth), then role (adminOnly)
router.get('/stats', auth, adminOnly, (req, res) => {
  res.json({ message: 'Admin stats', user: { id: req.user._id, role: req.user.role } });
});

// Add your real admin routes below, always: auth -> adminOnly -> handler
// router.post('/something', auth, adminOnly, adminController.doSomething);

module.exports = router;
