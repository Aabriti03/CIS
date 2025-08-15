// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/** Helper: sign a JWT in the legacy shape {_id: ...} */
const signToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

/** Helper: shape the user object we return to the frontend */
const toPublicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  category: u.category ?? null,
});

// =========================== REGISTER ===========================
/**
 * POST /api/auth/register
 * body: { name, email, phone, password, role, category? }
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, category } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res
        .status(400)
        .json({ message: 'Please provide all required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      // Only persist category for workers
      category: role === 'worker' ? category ?? null : null,
    });

    // Auto-login after register to match frontend flow
    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error('registerUser error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ============================= LOGIN =============================
/**
 * POST /api/auth/login
 * body: { email, password }
 * returns: { token, user: {...} }
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // If your User schema hides password by default, this ensures we can compare
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);

    return res.status(200).json({
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error('loginUser error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ============================ PROFILE ============================
/**
 * GET /api/auth/profile
 * headers: Authorization: Bearer <token>
 * returns: user (without password)
 */
exports.getProfile = async (req, res) => {
  try {
    const id = req.user?._id || req.user?.id;
    if (!id) return res.status(401).json({ message: 'Unauthorized' });

    const u = await User.findById(id).select('-password');
    if (!u) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      address: u.address ?? null,
      role: u.role,
      category: u.category ?? null,
      createdAt: u.createdAt
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
