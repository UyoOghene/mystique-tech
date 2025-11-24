import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        // For guest users, load from localStorage
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          setCartItems(JSON.parse(guestCart));
        }
        return;
      }

      try {
        const token = localStorage.getItem('mystiqueTechToken');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setCartItems(data);
        } else {
          console.error('Failed to fetch cart');
        }
      } catch (err) {
        console.error('Fetch cart error:', err);
        // Fallback to localStorage for guest
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          setCartItems(JSON.parse(guestCart));
        }
      }
    };

    fetchCart();
  }, [user]);

  const saveCartToBackend = async (items) => {
    if (!user) {
      // Save to localStorage for guest users
      localStorage.setItem('guestCart', JSON.stringify(items));
      return;
    }

    try {
      const token = localStorage.getItem('mystiqueTechToken');
      await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });
    } catch (err) {
      console.error('Save cart error:', err);
    }
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      // Use product.id for frontend, _id for backend
      const productId = product.id || product._id;
      const existing = prev.find(item => (item.id || item._id) === productId);
      
      let updated;
      if (existing) {
        updated = prev.map(item => 
          (item.id || item._id) === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Ensure product has both id and _id for consistency
        updated = [...prev, { 
          ...product, 
          id: productId,
          _id: productId,
          quantity: 1 
        }];
      }
      
      saveCartToBackend(updated);
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => (item.id || item._id) !== productId);
      saveCartToBackend(updated);
      return updated;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prev => {
      if (quantity <= 0) {
        const updated = prev.filter(item => (item.id || item._id) !== productId);
        saveCartToBackend(updated);
        return updated;
      }
      
      const updated = prev.map(item => 
        (item.id || item._id) === productId 
          ? { ...item, quantity } 
          : item
      );
      saveCartToBackend(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartToBackend([]);
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
      getCartItemsCount
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