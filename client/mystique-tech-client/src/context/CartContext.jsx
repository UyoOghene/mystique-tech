import React, { createContext, useState, useContext } from 'react';
import { calculateCartTotal, updateCartItemQuantity, addItemToCart } from '../utils/cartHelpers';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => addItemToCart(prevItems, product));
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems => updateCartItemQuantity(prevItems, productId, quantity));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return calculateCartTotal(cartItems);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Only export components
export { CartProvider, useCart };