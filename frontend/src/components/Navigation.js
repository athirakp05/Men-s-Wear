// src/components/Navigation.js
// Save this in a separate file or include in App.js

import React, { useState, useContext } from 'react';
import { ShoppingCart, Menu, X, LogOut, Package, Home } from 'lucide-react';
import { AuthContext } from '../App'; // If in separate file

const Navigation = ({ cartCount, onNavigate, currentPage }) => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold cursor-pointer hover:text-blue-400 transition-colors" 
              onClick={() => onNavigate('home')}
            >
              MensWear
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => onNavigate('home')} 
              className="hover:text-blue-400 flex items-center gap-2 transition-colors"
            >
              <Home size={20} /> Home
            </button>
            
            {user && (
              <>
                <button 
                  onClick={() => onNavigate('orders')} 
                  className="hover:text-blue-400 flex items-center gap-2 transition-colors"
                >
                  <Package size={20} /> Orders
                </button>
                
                <button 
                  onClick={() => onNavigate('cart')} 
                  className="relative hover:text-blue-400 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">Hi, {user.username}</span>
                <button 
                  onClick={handleLogout} 
                  className="hover:text-red-400 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')} 
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-4 space-y-3">
          <button 
            onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} 
            className="block w-full text-left hover:text-blue-400 py-2"
          >
            Home
          </button>
          
          {user && (
            <>
              <button 
                onClick={() => { onNavigate('orders'); setIsMenuOpen(false); }} 
                className="block w-full text-left hover:text-blue-400 py-2"
              >
                Orders
              </button>
              <button 
                onClick={() => { onNavigate('cart'); setIsMenuOpen(false); }} 
                className="block w-full text-left hover:text-blue-400 py-2"
              >
                Cart ({cartCount})
              </button>
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                className="block w-full text-left hover:text-red-400 py-2"
              >
                Logout
              </button>
            </>
          )}
          
          {!user && (
            <button 
              onClick={() => { onNavigate('login'); setIsMenuOpen(false); }} 
              className="block w-full text-left bg-blue-600 px-4 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;