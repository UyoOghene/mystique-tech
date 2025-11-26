import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTransferred, setCartTransferred] = useState(false);

  // Load user's cart - FIXED: Only load when user changes
  useEffect(() => {
    const loadUserCart = async () => {
      if (!user) {
        // For guest users, use localStorage with guest key
        const guestCart = localStorage.getItem('guestCart');
        setCartItems(guestCart ? JSON.parse(guestCart) : []);
        setCartTransferred(false);
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
        } else {
          console.log('Cart API not available, using localStorage');
          // Fallback to localStorage
          const userCart = localStorage.getItem(`userCart_${user.id}`);
          setCartItems(userCart ? JSON.parse(userCart) : []);
        }
      } catch (error) {
        console.log('Cart API error, using localStorage');
        // Fallback to localStorage
        const userCart = localStorage.getItem(`userCart_${user.id}`);
        setCartItems(userCart ? JSON.parse(userCart) : []);
      } finally {
        setLoading(false);
      }
    };

    loadUserCart();
  }, [user]);

  // Save cart to appropriate storage - FIXED: Only save when cartItems change
  useEffect(() => {
    if (cartItems.length === 0) {
      // Clear storage if cart is empty
      if (!user) {
        localStorage.removeItem('guestCart');
      } else {
        localStorage.removeItem(`userCart_${user.id}`);
      }
      return;
    }
    
    if (!user) {
      // Guest cart
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    } else {
      // User cart - save to localStorage as fallback
      localStorage.setItem(`userCart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Define addToCart with useCallback to prevent infinite loops
  const addToCart = useCallback(async (product) => {
    const productId = product.id || product._id;
    
    setCartItems(prevCart => {
      const existingItem = prevCart.find(item => (item.id || item._id) === productId);
      
      if (existingItem) {
        return prevCart.map(item => 
          (item.id || item._id) === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { 
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
    });

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
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          })
        });
      } catch (error) {
        console.warn('Backend sync failed, using localStorage only');
      }
    }
  }, [user]);

  const removeFromCart = async (productId) => {
    setCartItems(prevCart => prevCart.filter(item => (item.id || item._id) !== productId));

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
        console.warn('Backend sync failed for remove');
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevCart => 
      prevCart.map(item => 
        (item.id || item._id) === productId 
          ? { ...item, quantity } 
          : item
      )
    );

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
        console.warn('Backend sync failed for update');
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
        console.warn('Backend sync failed for clear');
      }
    }
  };

  // Transfer guest cart to user cart on login - COMPLETELY REWRITTEN
  useEffect(() => {
    const transferGuestCart = async () => {
      // Only transfer if we have a user, haven't transferred yet, and have guest cart items
      if (!user || cartTransferred) return;

      const guestCart = localStorage.getItem('guestCart');
      if (!guestCart) {
        setCartTransferred(true);
        return;
      }

      const guestItems = JSON.parse(guestCart);
      if (guestItems.length === 0) {
        setCartTransferred(true);
        return;
      }

      console.log('Starting guest cart transfer:', guestItems);
      
      try {
        const token = localStorage.getItem('mystiqueTechToken');
        
        // Add each guest item to backend
        for (const item of guestItems) {
          const productId = item.id || item._id;
          
          await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              productId: productId,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity
            })
          });
        }

        // Clear guest cart and mark as transferred
        localStorage.removeItem('guestCart');
        setCartTransferred(true);
        
        // Reload cart from backend to get updated state
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || []);
        }
        
        console.log('Guest cart transfer completed successfully');
      } catch (error) {
        console.error('Guest cart transfer failed:', error);
        // Even if transfer fails, mark as transferred to prevent retries
        setCartTransferred(true);
      }
    };

    transferGuestCart();
  }, [user, cartTransferred]);

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