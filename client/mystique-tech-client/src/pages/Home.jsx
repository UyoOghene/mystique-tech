// client/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      <section 
        style={{
          background: 'linear-gradient(to right, var(--mystique-purple-500), var(--mystique-pink-500))',
          backgroundImage: 'url(/images/airpods-7226558_1280.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="text-white py-20 h-[80vh] "
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-elegant mb-6">Welcome to Mystique Tech</h1>
          <p className="text-xl mb-8">Discover beautifully designed tech gadgets that combine style and functionality</p>
          <Link 
            to="/products" 
            style={{
              backgroundColor: 'white',
              color: 'var(--mystique-purple-600)'
            }}
            className="px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-100 transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 
            style={{ color: 'var(--mystique-purple-800)' }}
            className="text-3xl font-elegant text-center mb-12"
          >
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
              <div 
                style={{
                  background: 'linear-gradient(135deg, var(--mystique-purple-100), var(--mystique-pink-100))'
                }}
                className="h-48 rounded-lg mb-4 flex items-center justify-center"
              >
                <img src="
                /images/airpods-7976095_1280.jpg" alt="" />
              </div>
              <h3 style={{ color: 'var(--mystique-purple-800)' }} className="text-xl font-semibold mb-2">Rose Gold Laptop</h3>
              <p className="text-gray-600 mb-4">Elegant and powerful for the modern professional</p>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--mystique-pink-600)' }} className="font-bold text-lg">$1,299.99</span>
                <button 
                  style={{
                    background: 'linear-gradient(to right, var(--mystique-purple-500), var(--mystique-pink-500))'
                  }}
                  className="text-white px-4 py-2 rounded-full hover:opacity-90 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;