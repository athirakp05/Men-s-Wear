import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Truck } from 'lucide-react';
import { productService, categoryService } from '../api/services';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getFeatured(),
          categoryService.getAll(),
        ]);
        setFeaturedProducts(productsRes.data.slice(0, 4));
        // Ensure categories is always an array
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error
        setFeaturedProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-400 relative text-white to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Elevate Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Style Game
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-dark-200 mb-8">
              Discover premium menswear that defines sophistication and comfort. Curated collections for the modern gentleman.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-white text-dark-900 px-8 py-4 rounded-lg font-semibold hover:bg-dark-50 transition-all duration-300 flex items-center space-x-2">
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-900 text-white rounded-full mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-dark-600">On orders over ₹ 100</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-900 text-white rounded-full mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-dark-600">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-900 text-white rounded-full mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-dark-600">Handpicked collections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="section-title mb-0">Featured Products</h2>
            <Link to="/products" className="text-dark-700 hover:text-dark-900 font-medium flex items-center space-x-2">
              <span>View All</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="bg-dark-200 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-dark-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-dark-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

     

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-400 text-white to-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Style Revolution
          </h2>
          <p className="text-xl text-dark-200 mb-8">
            Sign up to get exclusive deals and early access to new collections
          </p>
          <Link to="/register" className="bg-white text-dark-900 px-8 py-4 rounded-lg font-semibold hover:bg-dark-50 transition-all duration-300 inline-block">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;