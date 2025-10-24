import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../api/services';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: '',
    phone_number: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cart || cart.items?.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }

    setLoading(true);
    try {
      const response = await orderService.create(formData);
      alert('Order placed successfully!');
      await clearCart();
      navigate(`/orders`);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Your cart is empty</h2>
          <button onClick={() => navigate('/products')} className="btn-primary mt-4">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-dark-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="card p-6">
                <h2 className="text-2xl font-semibold text-dark-900 mb-6">
                  Shipping Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      placeholder="+1 (555) 123-4567"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Shipping Address *
                    </label>
                    <textarea
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Enter your complete shipping address"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-2xl font-semibold text-dark-900 mb-6">
                  Payment Method
                </h2>
                <div className="bg-dark-50 p-4 rounded-lg">
                  <p className="text-dark-700">Cash on Delivery</p>
                  <p className="text-sm text-dark-500 mt-1">
                    Pay when you receive your order
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-semibold text-dark-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-dark-100">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-dark-900 text-sm">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-dark-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-dark-900">
                      ₹ {item.subtotal}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-dark-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹ {cart.total_price}</span>
                </div>
                <div className="flex justify-between text-dark-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-dark-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-dark-900">
                      ₹ {cart.total_price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;