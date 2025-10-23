import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../api/services';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addItem({ product_id: productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to add item' };
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await cartService.updateItem({ cart_item_id: cartItemId, quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to update item' };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartService.removeItem({ cart_item_id: cartItemId });
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to remove item' };
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to clear cart' };
    }
  };

  const cartItemsCount = cart?.items?.length || 0;
  const cartTotal = cart?.total_price || 0;

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        loading, 
        addToCart, 
        updateCartItem, 
        removeFromCart, 
        clearCart,
        cartItemsCount,
        cartTotal,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};