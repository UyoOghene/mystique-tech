const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image category inStock');

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ 
        user: req.user._id, 
        items: [] 
      });
    }

    // Transform the data for frontend
    const transformedItems = cart.items.map(item => ({
      _id: item._id,
      id: item.product._id, // For frontend compatibility
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      category: item.product.category,
      inStock: item.product.inStock,
      quantity: item.quantity
    }));

    res.json({
      items: transformedItems,
      total: cart.total,
      itemsCount: cart.itemsCount
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
router.post('/items', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price,
        name: product.name,
        image: product.image
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price image category inStock');

    // Transform response
    const transformedItems = cart.items.map(item => ({
      _id: item._id,
      id: item.product._id,
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      category: item.product.category,
      inStock: item.product.inStock,
      quantity: item.quantity
    }));

    res.json({
      success: true,
      items: transformedItems,
      total: cart.total,
      itemsCount: cart.itemsCount,
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

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name price image category inStock');

    // Transform response
    const transformedItems = cart.items.map(item => ({
      _id: item._id,
      id: item.product._id,
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      category: item.product.category,
      inStock: item.product.inStock,
      quantity: item.quantity
    }));

    res.json({
      success: true,
      items: transformedItems,
      total: cart.total,
      itemsCount: cart.itemsCount,
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

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );

    await cart.save();
    await cart.populate('items.product', 'name price image category inStock');

    // Transform response
    const transformedItems = cart.items.map(item => ({
      _id: item._id,
      id: item.product._id,
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      category: item.product.category,
      inStock: item.product.inStock,
      quantity: item.quantity
    }));

    res.json({
      success: true,
      items: transformedItems,
      total: cart.total,
      itemsCount: cart.itemsCount,
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
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

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