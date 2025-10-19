// src/components/Cart.js

import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { AuthContext } from '../App'; // If in separate file

const API_URL = 'http://localhost:8000/api';

const Cart = ({ onNavigate, onCartUpdate }) => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await res.json();
      setCart(data);
      onCartUpdate();
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setUpdating({ ...updating, [itemId]: true });
    try {
      const res = await fetch(`${API_URL}/cart/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ cart_item_id: itemId, quantity })
      });

      if (res.ok) {
        fetchCart();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update quantity');
      }
    } catch (err) {
      alert('Error updating cart');
    } finally {
      setUpdating({ ...updating, [itemId]: false });
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Remove this item from cart?')) return;

    try {
      const res = await fetch(`${API_URL}/cart/remove/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ cart_item_id: itemId })
      });

      if (res.ok) {
        fetchCart();
      } else {
        alert('Failed to remove item');
      }
    } catch (err) {
      alert('Error removing item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart && cart.items.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <p className="text-gray-500 mb-6">Add some products to get started</p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart?.items.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name} 
                      className="w-24 h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/96x96/CCCCCC/666666?text=No+Image';
                      }}
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm">{item.product.brand}</p>
                      <p className="text-sm text-gray-500">Size: {item.product.size}</p>
                      <p className="text-blue-600 font-semibold mt-1">
                        ${parseFloat(item.product.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls and Remove */}
                    <div className="flex flex-col items-end justify-between">
                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Remove item"
                      >
                        <X size={20} />
                      </button>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating[item.id]}
                          className="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating[item.id]}
                          className="bg-gray-200 w-8 h-8 rounded hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Subtotal */}
                      <p className="font-semibold text-lg">
                        ${parseFloat(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cart?.items.length})</span>
                    <span>${parseFloat(cart?.total_price || 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ${parseFloat(cart?.total_price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('checkout')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => onNavigate('home')}
                  className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;