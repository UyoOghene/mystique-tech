const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Simple in-memory storage for demo (replace with database later)
const userCarts = new Map();

// Helper function to get user cart
const getUserCart = (userId) => {
  if (!userCarts.has(userId)) {
    userCarts.set(userId, []);
  }
  return userCarts.get(userId);
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cart = getUserCart(userId);
    
    res.json({
      success: true,
      items: cart,
      total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      itemsCount: cart.reduce((total, item) => total + item.quantity, 0)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching cart' 
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
// routes/cartRoutes.js - Updated add item endpoint
router.post('/items', protect, async (req, res) => {
  try {
    const { productId, name, price, image, quantity = 1 } = req.body;
    const userId = req.user._id.toString();

    // Validate input
    if (!productId || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, name, and price are required'
      });
    }

    const cart = getUserCart(userId);
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      item => item.id === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart with real product data
      cart.push({
        id: productId,
        _id: productId,
        name: name,
        price: price,
        image: image || '/images/placeholder-product.jpg',
        quantity: quantity
      });
    }

    userCarts.set(userId, cart);

    res.json({
      success: true,
      items: cart,
      total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      itemsCount: cart.reduce((total, item) => total + item.quantity, 0),
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item to cart'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Private
router.put('/items/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id.toString();

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const cart = getUserCart(userId);
    
    if (quantity === 0) {
      // Remove item if quantity is 0
      const updatedCart = cart.filter(item => item.id !== itemId);
      userCarts.set(userId, updatedCart);
      
      return res.json({
        success: true,
        items: updatedCart,
        total: updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0),
        itemsCount: updatedCart.reduce((total, item) => total + item.quantity, 0),
        message: 'Item removed from cart'
      });
    }

    // Update quantity
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart[itemIndex].quantity = quantity;
    userCarts.set(userId, cart);

    res.json({
      success: true,
      items: cart,
      total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      itemsCount: cart.reduce((total, item) => total + item.quantity, 0),
      message: 'Cart updated successfully'
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
router.delete('/items/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id.toString();

    const cart = getUserCart(userId);
    const updatedCart = cart.filter(item => item.id !== itemId);
    userCarts.set(userId, updatedCart);

    res.json({
      success: true,
      items: updatedCart,
      total: updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0),
      itemsCount: updatedCart.reduce((total, item) => total + item.quantity, 0),
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing item from cart'
    });
  }
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    userCarts.set(userId, []);

    res.json({
      success: true,
      items: [],
      total: 0,
      itemsCount: 0,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
});

module.exports = router;