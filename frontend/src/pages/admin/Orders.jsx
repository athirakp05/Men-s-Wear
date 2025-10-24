import { useEffect, useState } from 'react';
import { adminOrderService } from '../../api/adminServices';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const response = await adminOrderService.getAll(params);
      // Ensure orders is always an array
      setOrders(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminOrderService.updateStatus(orderId, newStatus);
      alert('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-900">Orders Management</h1>
          <p className="text-dark-600 mt-2">View and manage customer orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status || 'all'}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-dark-900 text-white'
                    : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
                }`}
              >
                {status || 'All Orders'}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-dark-600">No orders found</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-dark-900">
                        Order #{order.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-dark-600 mb-1">
                      Customer: <span className="font-medium">{order.user.username}</span>
                    </p>
                    <p className="text-sm text-dark-600">
                      Date: {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="text-sm text-dark-600">Total Amount</p>
                    <p className="text-2xl font-bold text-dark-900">${order.total_amount}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-dark-100 pt-4 mb-4">
                  <h4 className="font-semibold text-dark-900 mb-3">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-dark-900">{item.product.name}</p>
                            <p className="text-sm text-dark-600">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-dark-900">${item.subtotal}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="border-t border-dark-100 pt-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-dark-700 mb-1">Shipping Address</p>
                      <p className="text-sm text-dark-600">{order.shipping_address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-700 mb-1">Phone</p>
                      <p className="text-sm text-dark-600">{order.phone_number}</p>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t border-dark-100 pt-4">
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;