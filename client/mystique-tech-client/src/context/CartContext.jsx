// context/CartContext.jsx - Fixed version
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTransferred, setCartTransferred] = useState(false);

  // Load user's cart
  useEffect(() => {
    const loadUserCart = async () => {
      if (!user) {
        // For guest users, use localStorage with guest key
        const guestCart = localStorage.getItem('guestCart');
        setCartItems(guestCart ? JSON.parse(guestCart) : []);
        setCartTransferred(false); // Reset transfer flag for guest
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

  // Define addToCart with useCallback to prevent infinite loops
  const addToCart = useCallback(async (product) => {
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
        console.warn('Backend sync failed, using localStorage only');
      }
    }
  }, [cartItems, user]);

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
        console.warn('Backend sync failed for remove');
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

  // Transfer guest cart to user cart on login - FIXED to prevent duplication
  useEffect(() => {
    const transferGuestCartToUser = async () => {
      if (user && !cartTransferred) {
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          const guestItems = JSON.parse(guestCart);
          if (guestItems.length > 0) {
            console.log('Transferring guest cart to user cart:', guestItems);
            
            // Clear current cart first to avoid duplicates
            const currentCart = [...cartItems];
            setCartItems([]);
            
            // Add each guest item to user cart one by one
            for (const item of guestItems) {
              // Use a timeout to ensure state updates properly
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Add item directly to avoid recursion
              const productToAdd = {
                id: item.id || item._id,
                _id: item.id || item._id,
                name: item.name,
                price: item.price,
                image: item.image,
                description: item.description,
                category: item.category
              };
              
              // Update cart state directly for this transfer
              setCartItems(prev => {
                const existing = prev.find(p => (p.id || p._id) === productToAdd.id);
                if (existing) {
                  return prev.map(p => 
                    (p.id || p._id) === productToAdd.id 
                      ? { ...p, quantity: p.quantity + item.quantity }
                      : p
                  );
                } else {
                  return [...prev, { ...productToAdd, quantity: item.quantity }];
                }
              });
              
              // Sync with backend
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
                      productId: productToAdd.id,
                      name: productToAdd.name,
                      price: productToAdd.price,
                      image: productToAdd.image,
                      quantity: item.quantity
                    })
                  });
                } catch (error) {
                  console.warn('Backend sync failed during transfer');
                }
              }
            }
            
            // Clear guest cart and mark as transferred
            localStorage.removeItem('guestCart');
            setCartTransferred(true);
            console.log('Guest cart transfer completed');
          }
        }
      }
    };

    transferGuestCartToUser();
  }, [user, cartTransferred]); // Removed addToCart dependency

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