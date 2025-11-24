import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import products from '../data/Products';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Select featured products
  const featuredProducts = products.filter(product => 
    [1, 3, 11].includes(product.id)
  );

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-500"></div>
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              Featured Collection
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-pink-500"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-elegant mb-6 text-purple-800">
            Curated Excellence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium tech gadgets that blend cutting-edge technology with elegant design.
          </p>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-10">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="relative group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Glassmorphism Card */}
              <div className="relative rounded-2xl overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-1 bg-white/25 backdrop-blur-lg border border-white/30 shadow-lg shadow-purple-100/50">
                
                {/* Product Image Container */}
                <div className="relative overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-purple-100/50 to-pink-100/50 flex items-center justify-center backdrop-blur-sm">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" 
                    />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-end justify-center pb-4">
                    <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out">
                      <Link 
                        to={`/product/${product.id}`}
                        className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 hover:bg-white transition-all duration-300 ease-out"
                      >
                        Quick View
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1 transition-all duration-300 ease-out group-hover:text-purple-700 text-purple-800">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3 transition-all duration-300 ease-out group-hover:text-gray-700">
                        {product.description}
                      </p>
                    </div>
                    {/* Featured Badge */}
                    <span className="px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ease-out group-hover:scale-110 bg-purple-100 text-purple-600">
                      Featured
                    </span>
                  </div>

                  {/* Price and Action */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold transition-all duration-300 ease-out group-hover:scale-105 text-pink-600">
                        ${product.price}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock || !user}
                      className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-out transform group-hover:scale-105 backdrop-blur-sm ${
                        product.inStock && user
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-200'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {user ? 'Add to Cart' : 'Login to Add'}
                    </button>
                  </div>

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="mt-3 text-center transition-all duration-300 ease-out">
                      <span className="text-red-500 text-sm font-semibold bg-red-50 px-3 py-1 rounded-full transition-all duration-300 ease-out">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Shine Effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ease-out hover:gap-4 group bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 animate-fade-in-up"
            style={{ animationDelay: '600ms' }}
          >
            View All Products
            <svg 
              className="w-5 h-5 transition-all duration-300 ease-out group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;