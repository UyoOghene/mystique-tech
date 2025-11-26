// Helper functions for cart operations
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const updateCartItemQuantity = (cartItems, productId, quantity) => {
  if (quantity <= 0) {
    return cartItems.filter(item => item._id !== productId);
  }
  return cartItems.map(item =>
    item._id === productId ? { ...item, quantity } : item
  );
};

export const addItemToCart = (cartItems, product) => {
  const existingItem = cartItems.find(item => item._id === product._id);
  if (existingItem) {
    return cartItems.map(item =>
      item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  return [...cartItems, { ...product, quantity: 1 }];
}; 