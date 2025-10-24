import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, ShoppingCart, Users, DollarSign, 
  TrendingUp, AlertCircle, Clock 
} from 'lucide-react';
import { 
  adminProductService, 
  adminOrderService, 
  adminUserService 
} from '../../api/adminServices';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: null,
    orders: null,
    users: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productStats, orderStats, userStats] = await Promise.all([
          adminProductService.getStats(),
          adminOrderService.getStats(),
          adminUserService.getStats(),
        ]);

        setStats({
          products: productStats.data,
          orders: orderStats.data,
          users: userStats.data,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-400 to-dark-900 text-white rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage your e-commerce platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-dark-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-dark-900">
              ₹{stats.orders?.total_revenue?.toFixed(2) || '0.00'}
            </h3>
            <p className="text-dark-600 text-sm mt-1">Total Revenue</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-dark-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
                {stats.orders?.pending_orders || 0} pending
              </span>
            </div>
            <h3 className="text-2xl font-bold text-dark-900">
              {stats.orders?.total_orders || 0}
            </h3>
            <p className="text-dark-600 text-sm mt-1">Total Orders</p>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-dark-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                {stats.products?.low_stock || 0} low
              </span>
            </div>
            <h3 className="text-2xl font-bold text-dark-900">
              {stats.products?.total_products || 0}
            </h3>
            <p className="text-dark-600 text-sm mt-1">Total Products</p>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-dark-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-dark-900">
              {stats.users?.total_users || 0}
            </h3>
            <p className="text-dark-600 text-sm mt-1">Total Users</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/products/new"
            className="bg-white rounded-xl shadow-sm p-6 border border-dark-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-dark-900 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-900">Add Product</h3>
                <p className="text-sm text-dark-600">Create new product</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-xl shadow-sm p-6 border border-dark-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-dark-900 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-900">Manage Orders</h3>
                <p className="text-sm text-dark-600">View all orders</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/categories"
            className="bg-white rounded-xl shadow-sm p-6 border border-dark-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-dark-900 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-900">Categories</h3>
                <p className="text-sm text-dark-600">Manage categories</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Alerts */}
        {(stats.products?.out_of_stock > 0 || stats.products?.low_stock > 0) && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-dark-100">
            <h2 className="text-xl font-semibold text-dark-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
              Inventory Alerts
            </h2>
            <div className="space-y-3">
              {stats.products?.out_of_stock > 0 && (
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">Out of Stock</p>
                      <p className="text-sm text-red-700">
                        {stats.products.out_of_stock} product(s) are out of stock
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/admin/products?filter=out_of_stock"
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    View →
                  </Link>
                </div>
              )}
              {stats.products?.low_stock > 0 && (
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-orange-900">Low Stock</p>
                      <p className="text-sm text-orange-700">
                        {stats.products.low_stock} product(s) have low stock
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/admin/products?filter=low_stock"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    View →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;