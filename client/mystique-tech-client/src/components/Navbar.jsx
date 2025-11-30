import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import xeLogo from '/images/Xe-logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems, getCartItemsCount: getCartCountFromContext } = useCart(); // Renamed here
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // SUPER SAFE user data access functions
  const getUserFirstName = () => {
    if (!user || typeof user !== 'object') return 'User';
    
    // Try multiple possible name fields
    if (user.firstName && typeof user.firstName === 'string') {
      return user.firstName;
    }
    if (user.name && typeof user.name === 'string') {
      return user.name.split(' ')[0] || 'User';
    }
    return 'User';
  };

  const getUserInitial = () => {
    const firstName = getUserFirstName();
    // Safe charAt with fallback
    return firstName && typeof firstName.charAt === 'function' 
      ? firstName.charAt(0).toUpperCase() 
      : 'U';
  };

  // Safe cart count calculation - RENAMED FUNCTION
  const calculateCartItemsCount = () => {
    if (getCartCountFromContext && typeof getCartCountFromContext === 'function') {
      return getCartCountFromContext();
    }
    
    if (!Array.isArray(cartItems)) return 0;
    
    return cartItems.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      return total + quantity;
    }, 0);
  };

  const cartItemsCount = calculateCartItemsCount(); // Use the renamed function

  // Check if user is admin safely
  const isUserAdmin = () => {
    if (!user || typeof user !== 'object') return false;
    return Boolean(user.role === 'admin' || user.isAdmin);
  };

  return (
    <nav className=" w-[100%] text-violet-400 font-extrabold p-4 bg-gradient-to-r backdrop-blur-xl from-black via-black to-black shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-between items-center">
          <Link 
            to="/" 
            className="text-3xl font-elegant font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={xeLogo}
              alt="XE-Tech Logo" 
              width={100}  
              className="mr-2"
            />
          </Link>
          
          <div className="flex items-center space-x-8">
            <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={() => setIsMenuOpen(false)}>
              Products
            </NavLink>
            
            {user ? (
              <>
                <CartLink 
                  itemsCount={cartItemsCount} 
                  onClick={() => setIsMenuOpen(false)}
                />
                {isUserAdmin() && (
                  <AdminLink onClick={() => setIsMenuOpen(false)} />
                )}
                <UserSection 
                  onLogout={handleLogout}
                  userInitial={getUserInitial()}
                  userFirstName={getUserFirstName()}
                />
              </>
            ) : (
              <AuthLinks onClick={() => setIsMenuOpen(false)} />
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden w-[100%] overflow-hidden flex justify-between items-center">
          <Link to="/" className="text-2xl font-elegant font-bold flex items-center">
            <img 
              src={xeLogo}
              alt="XE-Tech Logo" 
              width={80}  
              className="mr-2"
            />
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-violet-100/5 backdrop-blur-xl hover:bg-white/10 transition duration-300"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-violet-900/5 backdrop-blur-xl rounded-2xl p-6">
            <div className="flex flex-col space-y-4">
              <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/products" onClick={() => setIsMenuOpen(false)}>
                Products
              </MobileNavLink>
              
              {user ? (
                <>
                  <MobileCartLink 
                    itemsCount={cartItemsCount} 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  {isUserAdmin() && (
                    <MobileAdminLink onClick={() => setIsMenuOpen(false)} />
                  )}
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-pink-200 font-bold">
                        Hello, {getUserFirstName()}
                      </span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition duration-300 text-center"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-white/20 flex flex-col space-y-3">
                  <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </MobileNavLink>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-white text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-100 transition duration-300 text-center font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-50 to-transparent animate-pulse delay-500"></div>
    </nav>
  );
};

// Reusable Desktop Link Components
const NavLink = ({ to, onClick, children }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="relative font-medium hover:text-pink-200 transition duration-300 group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-300 transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

const CartLink = ({ itemsCount, onClick }) => (
  <Link 
    to="/cart" 
    onClick={onClick}
    className="relative font-medium hover:text-pink-200 transition duration-300 group flex items-center space-x-1"
  >
    <span>Cart</span>
    {itemsCount > 0 && (
      <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
        {itemsCount > 9 ? '9+' : itemsCount}
      </span>
    )}
  </Link>
);

const AdminLink = ({ onClick }) => (
  <Link 
    to="/admin" 
    onClick={onClick}
    className="relative font-medium hover:text-pink-200 transition duration-300 group"
  >
    Admin
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

// UPDATED: UserSection without any direct user object access
const UserSection = ({ onLogout, userInitial, userFirstName }) => (
  <div className="flex items-center space-x-4 pl-4 border-l border-white/20">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-pink-200">
          {userInitial}
        </span>
      </div>
      <span className="text-pink-200 hidden lg:block">
        Hello, {userFirstName}
      </span>
    </div>
    <button 
      onClick={onLogout}
      className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-lg transition duration-300 border border-white/30 hover:border-white/50"
    >
      Logout
    </button>
  </div>
);

const AuthLinks = ({ onClick }) => (
  <div className="flex items-center space-x-4">
    <Link 
      to="/login" 
      onClick={onClick}
      className="font-medium hover:text-pink-200 transition duration-300"
    >
      Login
    </Link>
    <Link 
      to="/register" 
      onClick={onClick}
      className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-100 transition duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      Register
    </Link>
  </div>
);

// Mobile Link Components
const MobileNavLink = ({ to, onClick, children }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="block py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg transition duration-300 text-center"
  >
    {children}
  </Link>
);

const MobileCartLink = ({ itemsCount, onClick }) => (
  <Link 
    to="/cart" 
    onClick={onClick}
    className="block py-3 px-4 bg-white/5 hover:bg-white/10 rounded-lg transition duration-300 text-center flex items-center justify-center space-x-2"
  >
    <span>Cart</span>
    {itemsCount > 0 && (
      <span className="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {itemsCount > 9 ? '9+' : itemsCount}
      </span>
    )}
  </Link>
);

const MobileAdminLink = ({ onClick }) => (
  <Link 
    to="/admin" 
    onClick={onClick}
    className="block py-3 px-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition duration-300 text-center text-yellow-200"
  >
    Admin
  </Link>
);

export default Navbar;