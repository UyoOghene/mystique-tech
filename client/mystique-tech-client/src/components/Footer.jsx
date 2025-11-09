import React from 'react';
import { Link } from 'react-router-dom';
import SocialIcon from './SocialIcon';
import FooterLink from './FooterLink';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    
    <footer className="  bg-gray-900 text-white mt-auto">
      
      
      {/* Main Footer Content */}
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-2 text-center">
            <Link to="/" className="text-2xl  font-bold text-white">
              XE-Tech
            </Link>
            <p className="mt-4 text-gray-300 max-w-md text-sm leading-relaxed">
              Discover beautifully designed tech gadgets that combine style and functionality. 
              Elevate your everyday with innovation and cutting-edge technology.
            </p>
          </div>


          {/* Support */}
          {/* <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              <FooterLink to="/contact" text="Contact Us" />
              <FooterLink to="/shipping" text="Shipping Info" />
              <FooterLink to="/returns" text="Returns & Refunds" />
              <FooterLink to="/faq" text="FAQ" />
              <FooterLink to="/privacy" text="Privacy Policy" />
            </ul>
          </div> */}
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
              <p className="text-gray-300 text-sm">Get the latest on new products and promotions</p>
            </div>
            <div className="flex w-full lg:w-auto max-w-md">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 w-full flex-1"
              />
              <button className="bg-purple-600 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-purple-700 transition duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} XE-Tech. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-300">Privacy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition duration-300">Terms</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition duration-300">Cookies</Link>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;