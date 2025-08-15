// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db'); // make sure this connects to MongoDB
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRequestRoutes = require('./routes/postRequestRoutes'); // needed for /api/postrequests
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// -------- Core middleware --------
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// -------- CORS (reads allowed origins from .env or uses defaults) --------
const rawOrigins = process.env.CORS_ORIGINS ||
  'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175,http://localhost:5176,http://127.0.0.1:5176,http://localhost:3000';

const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow no-origin requests (Postman, curl) or whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests

// -------- Health check --------
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// -------- API routes --------
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/postrequests', postRequestRoutes);

// -------- 404 handler --------
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// -------- Error handler --------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message || err);
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Server error',
  });
});

// -------- Start server after DB connects --------
const PORT = process.env.PORT || 5000;
let server;

connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

// -------- Graceful shutdown for nodemon restarts --------
function shutdown(signal) {
  console.log(`\n↩️  Received ${signal}. Closing server...`);
  if (server) {
    server.close(() => {
      console.log('✅ Server closed. Exiting.');
      process.exit(0);
    });
    setTimeout(() => {
      console.warn('⚠️ Force exit.');
      process.exit(1);
    }, 3000);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
