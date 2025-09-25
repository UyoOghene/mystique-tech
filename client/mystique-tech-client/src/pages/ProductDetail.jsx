import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Fetch product details from API
    // For now, using mock data
    const mockProduct = {
      _id: id,
      name: "Rose Gold Wireless Earbuds",
      price: 129.99,
      description: "Premium wireless earbuds with exceptional sound quality and elegant rose gold finish.",
      image: "🎧",
      category: "Audio",
      inStock: true
    };
    setProduct(mockProduct);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    // Show success message
    alert('Product added to cart!');
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-12">
              <span className="text-8xl">{product.image}</span>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-elegant text-mystique-purple-800 mb-4">{product.name}</h1>
              <p className="text-mystique-pink-600 text-2xl font-bold mb-4">${product.price}</p>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Quantity:</label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l"
                  >
                    -
                  </button>
                  <span className="bg-gray-100 px-4 py-1">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-mystique-purple-500 to-mystique-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition duration-300 w-full mb-4"
              >
                Add to Cart
              </button>
              
              {product.inStock ? (
                <p className="text-green-600">In Stock</p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;