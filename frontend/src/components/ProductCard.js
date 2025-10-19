// src/components/ProductCard.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../App'; // If in separate file

const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useContext(AuthContext);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    await onAddToCart(product.id);
    setAdding(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image';
          }}
        />
        {product.is_featured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Brand */}
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        {/* Size and Stock Info */}
        <div className="flex justify-between items-center mb-3 text-sm">
          <span className="text-gray-600">
            <span className="font-medium">Size:</span> {product.size}
          </span>
          <span className={`${product.stock < 10 ? 'text-red-600' : 'text-gray-600'}`}>
            <span className="font-medium">Stock:</span> {product.stock}
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex justify-between items-center pt-3 border-t">
          <span className="text-2xl font-bold text-blue-600">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          
          {user ? (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {adding ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-sm font-medium"
            >
              Login to Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;