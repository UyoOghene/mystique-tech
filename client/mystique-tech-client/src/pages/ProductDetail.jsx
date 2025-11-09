import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import products from '../data/Products';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundProduct = products.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product && product.inStock) {
      // Add the product with quantity instead of multiple times
      addToCart({ ...product, quantity });
      alert(`${quantity} ${product.name}(s) added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('Please login to proceed with purchase');
      navigate('/login');
      return;
    }

    if (product && product.inStock) {
      addToCart({ ...product, quantity });
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Xe-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link 
            to="/products" 
            className="bg-gradient-to-r from-Xe-purple-500 to-Xe-pink-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition duration-300"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Mock multiple images for demonstration
  const productImages = [
    product.image,
    product.image,
    product.image,
  ];

  // Mock related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-Xe-purple-600">Home</Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link to="/products" className="text-gray-500 hover:text-Xe-purple-600">Products</Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-700">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden h-96 flex items-center justify-center">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex space-x-4 justify-center">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition duration-300 ${
                      selectedImage === index 
                        ? 'border-Xe-purple-500 ring-2 ring-Xe-purple-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-2xl font-bold text-Xe-pink-600">
                    ${product.price}
                  </span>
                  {product.inStock ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Extended Description */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex">
                    <span className="font-medium w-32">Category:</span>
                    <span className="capitalize">{product.category}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-32">SKU:</span>
                    <span>MT-{product.id.toString().padStart(4, '0')}</span>
                  </li>
                  <li className="flex">
                    <span className="font-medium w-32">Warranty:</span>
                    <span>1 Year Limited</span>
                  </li>
                </ul>
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="border-t border-gray-200 pt-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-l border-r border-gray-300 min-w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Max: {Math.min(10, product.inStock ? 10 : 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                {product.inStock ? (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={!user}
                      className={`flex-1 py-3 px-6 rounded-lg transition duration-300 font-semibold ${
                        user 
                          ? 'bg-gradient-to-r from-Xe-purple-500 to-Xe-pink-500 text-white hover:opacity-90'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {user ? 'Add to Cart' : 'Login to Add to Cart'}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={!user}
                      className={`flex-1 py-3 px-6 rounded-lg transition duration-300 font-semibold ${
                        user
                          ? 'bg-gray-900 text-white hover:bg-gray-800'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {user ? 'Buy Now' : 'Login to Buy'}
                    </button>
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg cursor-not-allowed font-semibold"
                  >
                    Out of Stock
                  </button>
                )}
                
                <div className="flex justify-center">
                  <Link 
                    to="/products" 
                    className="text-Xe-purple-600 hover:text-Xe-purple-800 font-medium transition duration-300"
                  >
                    ← Back to Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 hover:text-Xe-purple-600 transition duration-300">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center">
                      <span className="text-Xe-pink-600 font-bold">
                        ${relatedProduct.price}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        relatedProduct.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {relatedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;