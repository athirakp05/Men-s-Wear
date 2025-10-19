// src/App.js - Part 1: Main Structure and Auth Context

import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Home } from 'lucide-react';
import Navigation from './components/Navigation';

const API_URL = 'http://localhost:8000/api';


// ========================================
// AUTH CONTEXT
// ========================================
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/auth/user/`, {
        headers: { 'Authorization': `Token ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const login = async (username, password) => {
    const res = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const register = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data };
  };

  const logout = () => {
    if (token) {
      fetch(`${API_URL}/auth/logout/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` }
      });
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ========================================
// MAIN APP COMPONENT
// ========================================
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch(`${API_URL}/cart/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        const data = await res.json();
        const count = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
          <Navigation cartCount={cartCount} onNavigate={setCurrentPage} currentPage={currentPage} 
          />       
         {/* Import other components here */}
        
        {/* This structure will be completed with all components */}
        <p className="text-center p-8"></p>
      </div>
    </AuthProvider>
  );
}

// Export AuthContext for use in other components
export { AuthContext };