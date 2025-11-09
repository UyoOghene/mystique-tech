// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useAuth } from './AuthContext'; 

// const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const { user } = useAuth();

//   // Generate unique storage key for each user
//   const getCartStorageKey = () => {
//     return user ? `cart_${user.id}` : 'cart_guest';
//   };

//   // Load user-specific cart from localStorage when user changes
//   useEffect(() => {
//     const storageKey = getCartStorageKey();
//     const storedCart = localStorage.getItem(storageKey);
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }
//   }, [user]);

//   // Save cart to localStorage whenever cartItems change
//   useEffect(() => {
//     const storageKey = getCartStorageKey();
//     localStorage.setItem(storageKey, JSON.stringify(cartItems));
//   }, [cartItems, user]);

//   // Helper function to add item to cart
//   const addItemToCart = (items, product) => {
//     const existingItem = items.find(item => item.id === product.id);
    
//     if (existingItem) {
//       return items.map(item =>
//         item.id === product.id 
//           ? { ...item, quantity: item.quantity + 1 } 
//           : item
//       );
//     }
    
//     return [...items, { ...product, quantity: 1 }];
//   };

//   // Helper function to update cart item quantity
//   const updateCartItemQuantity = (items, productId, quantity) => {
//     if (quantity <= 0) {
//       return items.filter(item => item.id !== productId);
//     }
    
//     return items.map(item =>
//       item.id === productId ? { ...item, quantity } : item
//     );
//   };

//   // Helper function to calculate cart total
//   const calculateCartTotal = (items) => {
//     return items.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const addToCart = (product) => {
//     setCartItems(prevItems => addItemToCart(prevItems, product));
//   };

//   const removeFromCart = (productId) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
//   };

//   const updateQuantity = (productId, quantity) => {
//     setCartItems(prevItems => updateCartItemQuantity(prevItems, productId, quantity));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const getCartTotal = () => {
//     return calculateCartTotal(cartItems);
//   };

//   // Get total number of items in cart
//   const getCartItemsCount = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   const value = {
//     cartItems,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook to use cart context
// const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export { CartProvider, useCart };

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
        setCartItems([]);
        return;
      }

      try {
        const token = localStorage.getItem('mystiqueTechToken');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setCartItems(data);
      } catch (err) {
        console.error('Fetch cart error:', err);
      }
    };

    fetchCart();
  }, [user]);

  const saveCartToBackend = async (items) => {
    if (!user) return;

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
      const existing = prev.find(item => item._id === product._id);
      const updated = existing
        ? prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
      saveCartToBackend(updated);
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item._id !== productId);
      saveCartToBackend(updated);
      return updated;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prev => {
      const updated = prev.map(item => item._id === productId ? { ...item, quantity } : item);
      saveCartToBackend(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartToBackend([]);
  };

  const getCartTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const getCartItemsCount = () => cartItems.reduce((total, item) => total + item.quantity, 0);

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
