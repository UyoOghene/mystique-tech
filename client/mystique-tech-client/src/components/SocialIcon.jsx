import React from 'react';

const SocialIcon = ({ href, icon, label }) => {
  return (
    <a 
      href={href} 
      aria-label={label}
      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition duration-300 hover:scale-110 transform group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img 
        src={`/images/${icon}-icon.svg`} 
        alt={label}
        className="w-5 h-5 filter brightness-0 invert"
      />
    </a>
  );
};

export default SocialIcon;