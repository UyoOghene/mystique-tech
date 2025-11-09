import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink = ({ to, text }) => {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-300 hover:text-white transition duration-300 text-sm hover:translate-x-1 transform inline-block"
      >
        {text}
      </Link>
    </li>
  );
};

export default FooterLink;