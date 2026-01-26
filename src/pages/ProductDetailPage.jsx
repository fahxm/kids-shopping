import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.products.getById(id).then(res => {
        setProduct(res);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xl font-bold">Inflating your details...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-3xl font-bold">Oops! Product vanished.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <nav className="mb-8 flex text-sm text-gray-400 font-bold gap-2">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-blue-500">Shop</Link>
        <span>/</span>
        <span className="text-gray-800">{product.title}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-16">
        {/* Image Gallery */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-[3rem] p-4 shadow-xl border-4 border-white overflow-hidden aspect-square">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover rounded-[2.5rem]"
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white rounded-2xl border-2 border-transparent hover:border-blue-400 cursor-pointer overflow-hidden opacity-60 hover:opacity-100 transition">
                <img src={`https://picsum.photos/seed/${product.id + i}/400/400`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-black tracking-widest uppercase">
                {product.category}
              </span>
              <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-black">
                {product.gender}
              </span>
            </div>
            <h1 className="text-5xl font-black text-gray-800 leading-tight mb-2">{product.title}</h1>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400 text-xl">{'★'.repeat(5)}</div>
              <span className="text-gray-400 font-bold">({product.rating} / 5.0 Rating)</span>
            </div>
          </div>

          <p className="text-2xl font-black text-blue-600">${product.price.toFixed(2)}</p>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2 uppercase tracking-widest text-xs">Product Details</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-gray-100 rounded-full px-6 py-4 flex items-center gap-8">
              <button className="text-2xl font-bold text-gray-400 hover:text-blue-500">-</button>
              <span className="text-xl font-black text-gray-800">1</span>
              <button className="text-2xl font-bold text-gray-400 hover:text-blue-500">+</button>
            </div>
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black py-4 rounded-full shadow-lg transition transform active:scale-95 text-xl"
            >
              Add to Toy Box
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <span className="text-sm font-bold text-green-700">In Stock Ready to Ship</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">📦</div>
              <span className="text-sm font-bold text-yellow-700">Ages {product.ageRange} Recommended</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
