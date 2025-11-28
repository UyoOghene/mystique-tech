import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import products from '../data/Products';
import categories from '../data/Category';

const Products = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    // Pass the complete product object to preserve all data
    addToCart({
      id: product.id,
      _id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category
    });
    
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-elegant text-purple-800 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover our collection of beautifully designed tech gadgets
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full transition duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
              <Link to={`/product/${product.id}`}>
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center cursor-pointer">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover" 
                  />                
                </div>
              </Link>
              
              <div className="p-6">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xl font-semibold text-purple-800 mb-2 hover:text-purple-600 cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-pink-600 font-bold text-lg">
                    ${product.price}
                  </span>
                  {!product.inStock && (
                    <span className="text-red-500 text-sm font-semibold">Out of Stock</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition duration-300"
                  >
                    View Details
                  </Link>
                  
                  {user ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`flex-1 px-4 py-2 rounded transition duration-300 ${
                        product.inStock
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex-1 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded hover:opacity-90 transition duration-300"
                    >
                      Login to Add
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;