const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Absolute minimal CORS
app.use(cors());

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Minimal server is running',
    timestamp: new Date().toISOString()
  });
});

// Test auth route
app.post('/api/auth/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth endpoint is working',
    body: req.body 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/health`);
});