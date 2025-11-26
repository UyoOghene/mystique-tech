import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // For now, just show a success message
    alert('Thank you for your order! This is a demo - no real transaction occurred.');
    clearCart();
  };

  // Helper function to get product display data
  const getProductDisplayData = (item) => {
    return {
      id: item.id || item._id,
      name: item.name || 'Unnamed Product',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 0,
      image: item.image || '/images/placeholder-product.jpg'
    };
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-elegant text-purple-800 mb-4">Your Cart</h1>
            <p className="text-gray-600 mb-8">Your cart is empty</p>
            <Link 
              to="/products"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-elegant text-purple-800 mb-8 text-center">
          Your Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cart Items */}
          <div className="p-6">
            {cartItems.map((item) => {
              const product = getProductDisplayData(item);
              
              return (
                <div key={product.id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold text-purple-800 text-lg">{product.name}</h3>
                    <p className="text-pink-600 font-bold">${product.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition duration-300"
                    >
                      -
                    </button>
                    
                    <span className="w-8 text-center font-semibold text-lg">{product.quantity}</span>
                    
                    <button
                      onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition duration-300"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="ml-6 text-right">
                    <p className="font-semibold text-lg">${(product.price * product.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-1 transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Cart Summary */}
          <div className="bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal ({cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0)} items):</span>
              <span className="text-lg font-bold text-pink-600">${getCartTotal().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-gray-600">Free</span>
            </div>
            
            <div className="flex justify-between items-center mb-6 border-t border-gray-200 pt-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-xl font-bold text-pink-600">${getCartTotal().toFixed(2)}</span>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
              >
                Clear Cart
              </button>
              
              <button
                onClick={handleCheckout}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
            
            <Link 
              to="/products"
              className="block text-center text-purple-600 hover:text-purple-800 mt-4 transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;