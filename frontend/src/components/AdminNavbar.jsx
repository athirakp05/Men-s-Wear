import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/admin" className="text-2xl font-bold">
              STEFFIN ADMIN
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-dark-800 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/admin/products"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-dark-800 transition-colors"
              >
                <Package className="w-5 h-5" />
                <span>Products</span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-dark-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Orders</span>
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-dark-800 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Categories</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:block">View Store</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm hidden sm:block">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;