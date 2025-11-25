import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user's individual cart when user changes
  useEffect(() => {
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
          setCartItems(data.items || []);
        } else {
          console.error('Failed to load cart');
          setCartItems([]);
        }
      } catch (error) {
        console.error('Load cart error:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserCart();
  }, [user]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!user && cartItems.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product) => {
    if (!user) {
      // Guest cart - add to localStorage
      const productId = product.id || product._id;
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
          ...product, 
          id: productId,
          _id: productId,
          quantity: 1 
        }];
      }
      
      setCartItems(updatedCart);
      return;
    }

    // User cart - save to backend
    setLoading(true);
    try {
      const token = localStorage.getItem('mystiqueTechToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id || product._id,
          quantity: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      // Guest cart
      const updatedCart = cartItems.filter(item => (item.id || item._id) !== productId);
      setCartItems(updatedCart);
      return;
    }

    // User cart - find the cart item ID
    const cartItem = cartItems.find(item => (item.id || item._id) === productId);
    if (!cartItem) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('mystiqueTechToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${cartItem._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        console.error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) {
      // Guest cart
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
      return;
    }

    // User cart - find the cart item ID
    const cartItem = cartItems.find(item => (item.id || item._id) === productId);
    if (!cartItem) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('mystiqueTechToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${cartItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        console.error('Failed to update cart quantity');
      }
    } catch (error) {
      console.error('Update quantity error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      // Guest cart
      setCartItems([]);
      localStorage.removeItem('guestCart');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('mystiqueTechToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCartItems([]);
      } else {
        console.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Clear cart error:', error);
    } finally {
      setLoading(false);
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