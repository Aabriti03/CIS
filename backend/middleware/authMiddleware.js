// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Auth middleware:
 * - Reads Bearer token from Authorization header
 * - Verifies JWT
 * - Loads user (id, role, category) and attaches to req.user
 */
module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded._id).select('_id role category');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = { _id: user._id, role: user.role, category: user.category || null };
    return next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
