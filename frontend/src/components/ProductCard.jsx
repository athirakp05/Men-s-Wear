import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    const result = await addToCart(product.id, 1);
    
    if (result.success) {
      // Show success feedback
      setTimeout(() => setIsAdding(false), 1000);
    } else {
      alert(result.error);
      setIsAdding(false);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="card overflow-hidden group">
      <div className="relative overflow-hidden bg-dark-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-dark-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-dark-500 font-medium uppercase">{product.brand}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-dark-600">4.5</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-dark-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-dark-900">
            ₹{product.price}
          </span>
          <span className="text-sm text-dark-500">Size: {product.size}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;