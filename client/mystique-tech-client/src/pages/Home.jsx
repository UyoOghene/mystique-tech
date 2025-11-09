// client/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedProducts from '../components/FeaturedProducts';
import ContactUs from '../components/ContactUs';
import About from '../components/AboutUs';

const Home = () => {
  return (
    <div className="min-h-screen">
      <section 
        style={{
          background: 'linear-gradient(to right, var(--Xe-purple-500), var(--Xe-pink-500))',
          backgroundImage: 'url(/images/i-m-zion-Ya3r7oApP4g-unsplash.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="text-white py-20 h-[80vh] "
      >
        <div className="max-w-7xl mx-auto px-4 text-center bg-blue-50/10 w-[50%] backdrop-blur-lg h-[60%] rounded-2xl p-10 hero-txt">
          <h1 className="text-5xl font-elegant  mb-6"> XE-Tech</h1>
          <p className="text-xl mb-8">Discover beautifully designed tech gadgets that combine style and functionality</p>
          {/* <Link 
            to="/products" 
            style={{
              backgroundColor: 'white',
              color: 'var(--Xe-purple-600)'
            }}
            className="px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-100 transition duration-300"
          >
            Shop Now
          </Link> */}
          <Link 
  to="/products" 
  className="relative inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-200 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:shadow-lg border-2 border-white"
>
  Shop Now
  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
</Link>
        </div>
      </section>

      {/* Featured Products
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 
            style={{ color: 'var(--Xe-purple-800)' }}
            className="text-3xl font-elegant text-center mb-12"
          >
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-blue-400/10 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
              <div 
                style={{
                  background: 'linear-gradient(135deg, var(--Xe-purple-100), var(--Xe-pink-100))'
                }}
                className="h-48 rounded-lg mb-4 flex items-center justify-center"
              >
                <img src="
                /images/airpods-7976095_1280.jpg" alt=""
                className='rounded-lg h-full w-full object-cover'
                />
              </div>
              <h3 style={{ color: 'var(--Xe-purple-800)' }} className="text-xl font-semibold mb-2">Rose Gold Laptop</h3>
              <p className="text-gray-600 mb-4">Elegant and powerful for the modern professional</p>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--Xe-pink-600)' }} className="font-bold text-lg">$1,299.99</span>
                <button 
                  style={{
                    background: 'linear-gradient(to right, var(--Xe-purple-500), var(--Xe-pink-500))'
                  }}
                  className="text-white px-4 py-2 rounded-full hover:opacity-90 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="bg-blue-400/10 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
              <div 
                style={{
                  background: 'linear-gradient(135deg, var(--Xe-purple-100), var(--Xe-pink-100))'
                }}
                className="h-48 rounded-lg mb-4 flex items-center justify-center"
              >
                <img src="
                /images/airpods-7976095_1280.jpg" alt=""
                className='rounded-lg h-full w-full object-cover'
                />
              </div>
              <h3 style={{ color: 'var(--Xe-purple-800)' }} className="text-xl font-semibold mb-2">Rose Gold Laptop</h3>
              <p className="text-gray-600 mb-4">Elegant and powerful for the modern professional</p>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--Xe-pink-600)' }} className="font-bold text-lg">$1,299.99</span>
                <button 
                  style={{
                    background: 'linear-gradient(to right, var(--Xe-purple-500), var(--Xe-pink-500))'
                  }}
                  className="text-white px-4 py-2 rounded-full hover:opacity-90 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="bg-blue-400/10 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300">
              <div 
                style={{
                  background: 'linear-gradient(135deg, var(--Xe-purple-100), var(--Xe-pink-100))'
                }}
                className="h-48 rounded-lg mb-4 flex items-center justify-center"
              >
                <img src="
                /images/airpods-7976095_1280.jpg" alt=""
                className='rounded-lg h-full w-full object-cover'
                />
              </div>
              <h3 style={{ color: 'var(--Xe-purple-800)' }} className="text-xl font-semibold mb-2">Rose Gold Laptop</h3>
              <p className="text-gray-600 mb-4">Elegant and powerful for the modern professional</p>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--Xe-pink-600)' }} className="font-bold text-lg">$1,299.99</span>
                <button 
                  style={{
                    background: 'linear-gradient(to right, var(--Xe-purple-500), var(--Xe-pink-500))'
                  }}
                  className="text-white px-4 py-2 rounded-full hover:opacity-90 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <About />
      <FeaturedProducts />
            <ContactUs />

    </div>
  );
};

export default Home;