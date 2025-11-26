// server.js or app.js - Updated CORS configuration
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Enhanced CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://xetechcl.vercel.app',
    'https://xetech.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

// Test endpoint to verify CORS is working
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    message: 'CORS is working!',
    timestamp: new Date().toISOString(),
    allowedOrigins: [
      'https://xetechcl.vercel.app',
      'https://xetech.vercel.app'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running with CORS enabled',
    timestamp: new Date().toISOString()
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mystique Tech API!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;