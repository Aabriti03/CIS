// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Helper to sign a JWT for a user id
 */
const signToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

/**
 * Shape user object for client (never send password)
 */
const toPublicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  // category only exists for workers; keep null otherwise to avoid undefined
  category: u.category ?? null,
  // optional fields if present in your schema; harmless if absent
  address: u.address ?? null,
  createdAt: u.createdAt,
});

/**
 * POST /api/auth/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, category } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (role === 'worker' && !category) {
      return res.status(400).json({ message: 'Worker must have a category' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already used' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // ✅ Minimal necessary change: normalize worker category if present
    const normalizedCategory =
      role === 'worker' && category ? String(category).toLowerCase() : undefined;

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
      ...(role === 'worker' ? { category: normalizedCategory } : {}),
    });

    const token = signToken(user._id);
    return res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('registerUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/auth/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    return res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('loginUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const me = await User.findById(req.user._id)
      .select('_id name email phone role category address createdAt');

    if (!me) return res.status(404).json({ message: 'User not found' });

    return res.json(toPublicUser(me));
  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
