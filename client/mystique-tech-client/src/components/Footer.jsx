import React from 'react';
import { Link } from 'react-router-dom';
import xeLogo from '/images/Xe-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" md:w-[100vw] lg:[100vw] bg-gradient-to-br from-gray-900 to-black text-white mt-auto border-t border-purple-500/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
                        <Link to="/" className="text-2xl font-elegant font-bold flex items-center">
                          <img 
                            src={xeLogo}
                            alt="XE-Tech Logo" 
                            width={80}  
                            className="mr-2"
                          />
                        </Link>
              
              
            </div>
            <p className="text-gray-300 max-w-md text-sm leading-relaxed mb-4">
              Discover beautifully designed tech gadgets that combine style and functionality. 
              Elevate your everyday with innovation and cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              <SocialIcon 
                href="https://twitter.com" 
                icon="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                label="Twitter"
              />
              <SocialIcon 
                href="https://instagram.com" 
                icon="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                label="Instagram"
              />
              <SocialIcon 
                href="https://facebook.com" 
                icon="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                label="Facebook"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white font-elegant">Explore</h3>
            <ul className="space-y-3">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/products" text="Products" />
              <FooterLink to="/about" text="About Us" />
              <FooterLink to="/contact" text="Contact" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white font-elegant">Support</h3>
            <ul className="space-y-3">
              <FooterLink to="/shipping" text="Shipping Info" />
              <FooterLink to="/returns" text="Returns" />
              <FooterLink to="/faq" text="FAQ" />
              <FooterLink to="/privacy" text="Privacy Policy" />
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-purple-500/20 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h3 className="font-semibold text-lg mb-2 font-elegant">Stay Updated</h3>
              <p className="text-gray-300 text-sm">Get the latest on new products and exclusive promotions</p>
            </div>
            <div className="flex w-full lg:w-auto max-w-md bg-white/5 backdrop-blur-lg rounded-xl p-1">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 w-full flex-1 bg-transparent text-white placeholder-gray-400"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition duration-300 whitespace-nowrap shadow-lg hover:shadow-purple-500/25">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} <span className="text-purple-300">XE-Tech</span>. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <FooterLink to="/privacy" text="Privacy" className="text-gray-400 hover:text-white" />
            <FooterLink to="/terms" text="Terms" className="text-gray-400 hover:text-white" />
            <FooterLink to="/cookies" text="Cookies" className="text-gray-400 hover:text-white" />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
    </footer>
  );
};

// Social Icon Component
const SocialIcon = ({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 bg-white/5 hover:bg-purple-500/20 rounded-lg flex items-center justify-center transition duration-300 group border border-white/10 hover:border-purple-500/30"
    aria-label={label}
  >
    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition duration-300" fill="currentColor" viewBox="0 0 24 24">
      <path d={icon} />
    </svg>
  </a>
);

// Footer Link Component
const FooterLink = ({ to, text, className = "" }) => (
  <li>
    <Link 
      to={to} 
      className={`text-gray-400 hover:text-purple-300 transition duration-300 text-sm ${className}`}
    >
      {text}
    </Link>
  </li>
);

export default Footer;