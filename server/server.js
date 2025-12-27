const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const conversationRoutes = require('./src/routes/conversationRoutes');
const queryRoutes = require('./src/routes/queryRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const userRoutes = require('./src/routes/userRoutes');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Health Check Endpoint (ADD THIS - for testing connection)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'GyanMitra Backend',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3003,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler (ADD THIS - catches all errors)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 3003;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 For Android Emulator: http://10.0.2.2:${PORT}/api`);
});

module.exports = app;
