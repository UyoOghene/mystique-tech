import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    // <nav style={{ backgroundColor: 'var(--mystique-purple-600)' }} className="text-white p-4">
    <nav  className="text-black p-4 bg-blue/30 backdrop-blur-md  rounded-2xl shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-elegant font-bold">XE-Tech</Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-purple-200 transition duration-300">Home</Link>
          <Link to="/products" className="hover:text-purple-200 transition duration-300">Products</Link>
          
          {user ? (
            <>
              <Link to="/cart" className="hover:text-purple-200 transition duration-300 flex items-center">
                Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
              </Link>
              {(user.role === 'admin' || user.isAdmin) && (
                <Link to="/admin" className="hover:text-purple-200 transition duration-300">Admin</Link>
              )}
              <div className="flex items-center space-x-4">
                <span>Hello, {user.firstName}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-purple-600 px-4 py-1 rounded hover:bg-purple-100 transition duration-300"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-purple-200 transition duration-300">Login</Link>
              <Link 
                to="/register" 
                className="bg-white text-purple-600 px-4 py-1 rounded hover:bg-purple-100 transition duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;