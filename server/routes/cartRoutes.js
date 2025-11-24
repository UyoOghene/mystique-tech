const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Simple in-memory cart storage (replace with database later)
const userCarts = new Map();

// Get user cart
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cart = userCarts.get(userId) || [];
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart
router.put('/', protect, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user._id.toString();
    
    // Validate items
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }
    
    // Store cart
    userCarts.set(userId, items);
    
    res.json(items);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;