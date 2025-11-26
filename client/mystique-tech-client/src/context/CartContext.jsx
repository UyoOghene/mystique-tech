import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Test if cart API is available
  const testCartAPI = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/test`);
      return response.ok;
    } catch (error) {
      console.log('Cart API not available, using localStorage only');
      return false;
    }
  };
  testCartAPI();

  // Load user's cart
  useEffect(() => {
// In CartContext.js - Update the loadUserCart function
const loadUserCart = async () => {
  if (!user) {
    // For guest users, use localStorage
    const guestCart = localStorage.getItem('guestCart');
    setCartItems(guestCart ? JSON.parse(guestCart) : []);
    return;
  }

  setLoading(true);
  try {
    const token = localStorage.getItem('mystiqueTechToken');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });

    if (response.ok) {
      const data = await response.json();
      // Ensure all items have proper data structure
      const validatedItems = (data.items || []).map(item => ({
        id: item.id || item._id,
        _id: item.id || item._id,
        name: item.name || 'Unnamed Product',
        price: Number(item.price) || 0,
        image: item.image || '/images/placeholder-product.jpg',
        quantity: Number(item.quantity) || 1
      }));
      setCartItems(validatedItems);
    } else {
      console.log('Cart API not available, using localStorage');
      // Fallback to localStorage
      const userCart = localStorage.getItem(`userCart_${user.id}`);
      setCartItems(userCart ? JSON.parse(userCart) : []);
    }
  } catch (error) {
    console.log('Cart API error, using localStorage:', error);
    // Fallback to localStorage
    const userCart = localStorage.getItem(`userCart_${user.id}`);
    setCartItems(userCart ? JSON.parse(userCart) : []);
  } finally {
    setLoading(false);
  }
};

    loadUserCart();
  }, [user]);

  // Save cart to appropriate storage
  useEffect(() => {
    if (!user) {
      // Guest cart
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    } else {
      // User cart - save to localStorage as fallback
      localStorage.setItem(`userCart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

// context/CartContext.js - Updated addToCart function
const addToCart = async (product) => {
  const productId = product.id || product._id;
  
  // Immediate UI update with proper product data
  const existingItem = cartItems.find(item => (item.id || item._id) === productId);
  let updatedCart;
  
  if (existingItem) {
    updatedCart = cartItems.map(item => 
      (item.id || item._id) === productId 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
    );
  } else {
    updatedCart = [...cartItems, { 
      // Store all product details properly
      id: productId,
      _id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      quantity: 1 
    }];
  }
  
  setCartItems(updatedCart);

  // Try to sync with backend if user is logged in
  if (user) {
    try {
      const token = localStorage.getItem('mystiqueTechToken');
      await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productId,
          name: product.name, // Send product name
          price: product.price, // Send product price
          image: product.image, // Send product image
          quantity: 1
        })
      });
    } catch (error) {
      console.log('Backend sync failed, using localStorage only');
    }
  }
};

  const removeFromCart = async (productId) => {
    const updatedCart = cartItems.filter(item => (item.id || item._id) !== productId);
    setCartItems(updatedCart);

    // Sync with backend if user is logged in
    if (user) {
      try {
        const token = localStorage.getItem('mystiqueTechToken');
        await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.log('Backend sync failed for remove');
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      (item.id || item._id) === productId 
        ? { ...item, quantity } 
        : item
    );
    setCartItems(updatedCart);

    // Sync with backend if user is logged in
    if (user) {
      try {
        const token = localStorage.getItem('mystiqueTechToken');
        await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity })
        });
      } catch (error) {
        console.log('Backend sync failed for update');
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);

    // Sync with backend if user is logged in
    if (user) {
      try {
        const token = localStorage.getItem('mystiqueTechToken');
        await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.log('Backend sync failed for clear');
      }
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export { CartProvider, useCart };