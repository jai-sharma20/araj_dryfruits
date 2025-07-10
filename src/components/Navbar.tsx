import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { state, dispatch } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { name: 'Home', page: 'home' },
    { name: 'Shop', page: 'shop' },
    { name: 'About', page: 'about' },
    { name: 'Contact', page: 'contact' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' 
        : 'bg-white/95 backdrop-blur-sm shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200" onClick={() => onPageChange('home')}>
            <img 
              src="/src/assets/Untitled design (16).png" 
              alt="Araj Dry Fruits & Spices" 
              className="h-16 w-auto md:h-18 lg:h-20"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onPageChange(item.page)}
                className={`font-poppins font-medium transition-all duration-300 transform hover:scale-105 relative group ${
                  currentPage === item.page
                    ? 'text-maroon-600'
                    : 'text-gray-700 hover:text-maroon-600 hover:-translate-y-0.5'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-maroon-600 transition-all duration-300 group-hover:w-full ${
                  currentPage === item.page ? 'w-full' : ''
                }`}></span>
              </button>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 animate-fade-in">
            <button className="text-gray-700 hover:text-maroon-600 transition-all duration-200 transform hover:scale-110 hover:-translate-y-0.5">
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="relative text-gray-700 hover:text-maroon-600 transition-all duration-200 transform hover:scale-110 hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-maroon-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-maroon-600 transition-all duration-200 transform hover:scale-110"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onPageChange(item.page);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 transform hover:scale-105 ${
                    currentPage === item.page
                      ? 'text-maroon-600 bg-maroon-50'
                      : 'text-gray-700 hover:text-maroon-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;