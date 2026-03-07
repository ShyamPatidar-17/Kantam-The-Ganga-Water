import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 text-center text-gray-400 text-sm border-t border-gray-100">
      <p>© {new Date().getFullYear()} AquaFlow Seller Portal • Version 1.0.2</p>
    </footer>
  );
};

export default Footer;