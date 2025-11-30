// client/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedProducts from '../components/FeaturedProducts';
import ContactUs from '../components/ContactUs';
import About from '../components/AboutUs';

const Home = () => {
  return (
    <div className="min-h-screen w-[100vw] flex flex-col items-center overflow-hidden">
      <section 
        style={{
          background: 'linear-gradient(to right, var(--Xe-purple-500), var(--Xe-pink-500))',
          backgroundImage: 'url(/images/i-m-zion-Ya3r7oApP4g-unsplash.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="text-white py-20 h-[80vh] flex flex-col items-center "
      >
        <div className="max-w-[65%] h-[70%] flex flex-col mx-5 items-center justify-center px-5 text-center bg-blue-50/10 w-[70%] backdrop-blur-lg rounded-2xl p-[10em] hero-txt">
          <h1 className="text-5xl font-elegant  mb-5"> XE-Tech</h1>
          <p className="textlg m-5">Discover beautifully designed tech gadgets that combine style and functionality</p>
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

      <About />
      <FeaturedProducts />
            <ContactUs />

    </div>
  );
};

export default Home;