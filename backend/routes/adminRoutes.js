const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roles');

// Example admin health check (no auth)
router.get('/health', (req, res) => res.json({ ok: true, scope: 'admin' }));

// ✅ Protect admin routes: token check -> role check
router.get('/stats', auth, requireRole('admin'), (req, res) => {
  res.json({
    message: 'Admin stats',
    user: { id: req.user._id, role: req.user.role }
  });
});

// Add your real admin routes below (always auth -> requireRole('admin') -> handler)
// router.post('/something', auth, requireRole('admin'), adminController.doSomething);

module.exports = router;
