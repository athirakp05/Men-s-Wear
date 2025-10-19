// src/components/Checkout.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../App'; // If in separate file

const API_URL = 'http://localhost:8000/api';

const Checkout = ({ onNavigate }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ 
    shipping_address: '', 
    phone_number: '' 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shipping_address.trim()) {
      newErrors.shipping_address = 'Shipping address is required';
    } else if (formData.shipping_address.trim().length < 10) {
      newErrors.shipping_address = 'Please enter a complete address';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Order placed successfully!');
        onNavigate('orders');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to place order');
      }
    } catch (err) {
      alert('Error placing order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-8">Complete your order by providing shipping details</p>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Address *
              </label>
              <textarea
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                  errors.shipping_address ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="4"
                placeholder="Enter your complete shipping address including street, city, state, and postal code"
                required
              />
              {errors.shipping_address && (
                <p className="text-red-600 text-sm mt-1">{errors.shipping_address}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Please provide a complete address for accurate delivery
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                  errors.phone_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
                required
              />
              {errors.phone_number && (
                <p className="text-red-600 text-sm mt-1">{errors.phone_number}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                We'll contact you if there are any issues with your order
              </p>
            </div>

            {/* Order Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Order Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Free shipping on all orders</li>
                <li>• Estimated delivery: 3-5 business days</li>
                <li>• You will receive an order confirmation email</li>
                <li>• Track your order from the Orders page</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => onNavigate('cart')}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔒 Your information is secure and will not be shared with third parties</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;