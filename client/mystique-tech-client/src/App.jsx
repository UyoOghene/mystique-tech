import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Checkout from './pages/Checkout';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/cart" 
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    } 
                  />
                
                  <Route 
                    path="/checkout" 
                    element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <PrivateRoute>
                        <Admin />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;