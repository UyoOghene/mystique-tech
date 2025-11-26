// context/CartContext.js - Updated functions
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user's cart
  useEffect(() => {
    const loadUserCart = async () => {
      if (!user) {
        // For guest users, use localStorage with guest key
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
          console.log('Loaded cart from backend:', data.items);
          setCartItems(data.items || []);
          
          // Also save to localStorage as backup
          localStorage.setItem(`userCart_${user.id}`, JSON.stringify(data.items || []));
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
    if (cartItems.length === 0) return;
    
    if (!user) {
      // Guest cart
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    } else {
      // User cart - save to localStorage as fallback
      localStorage.setItem(`userCart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product) => {
    const productId = product.id || product._id;
    
    // Immediate UI update
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
        // Store complete product information
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          })
        });

        if (!response.ok) {
          console.warn('Backend sync failed, using localStorage only');
        }
      } catch (error) {
        console.log('Backend sync failed, using localStorage only:', error);
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

    // Clear both localStorage entries
    localStorage.removeItem('guestCart');
    if (user) {
      localStorage.removeItem(`userCart_${user.id}`);
    }

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

  // Transfer guest cart to user cart on login
  useEffect(() => {
    const transferGuestCartToUser = async () => {
      if (user) {
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          const guestItems = JSON.parse(guestCart);
          if (guestItems.length > 0) {
            console.log('Transferring guest cart to user cart:', guestItems);
            
            // Add each guest item to user cart
            for (const item of guestItems) {
              await addToCart(item);
            }
            
            // Clear guest cart
            localStorage.removeItem('guestCart');
          }
        }
      }
    };

    transferGuestCartToUser();
  }, [user]);

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