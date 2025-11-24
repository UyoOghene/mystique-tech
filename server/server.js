const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://xetech.vercel.app', // Replace with your actual frontend URL
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Mystique Tech API is running',
    timestamp: new Date().toISOString()
  });
});

// Test if routes are working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API routes are working!' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mystique Tech API!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mystique-tech')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

// Export for Vercel
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}