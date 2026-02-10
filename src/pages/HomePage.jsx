import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AgeGroup } from '../types.js';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    api.products.getFeatured().then(setFeatured);
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1513159419869-1133c151a662?auto=format&fit=crop&q=80&w=1600"
            alt="Playful background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl bg-white/90 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl border-4 border-yellow-300 transform -rotate-1">
            <h1 className="text-5xl md:text-6xl font-black mb-6 text-blue-600 leading-tight">
              Small Styles, <br />
              <span className="text-pink-500 underline decoration-yellow-400">Big Adventures!</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 font-medium">
              Explore our curated collection of magical toys and trendy apparel for children aged 0 to 15.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-black py-4 px-10 rounded-full text-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Shop Everything
              </Link>
              <Link to="/shop?category=Toys" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Cool Toys
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-pink-500 font-bold uppercase tracking-widest text-sm">Hand-picked</span>
            <h2 className="text-4xl font-black text-gray-800">Featured Arrivals</h2>
          </div>
          <Link to="/shop" className="text-blue-500 font-bold hover:underline">View All Products &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map(product => (
            <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-transparent hover:border-blue-100">
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-pink-500 shadow-sm uppercase tracking-tighter">
                  {product.category}
                </div>
              </Link>
              <div className="p-6">
                <Link to={`/product/${product.id}`} className="block font-bold text-gray-800 text-lg mb-1 truncate group-hover:text-blue-500 transition-colors">
                  {product.title}
                </Link>
                <div className="flex items-center text-yellow-400 text-sm mb-4">
                  {'★'.repeat(Math.floor(product.rating))}
                  <span className="text-gray-400 ml-1 font-medium">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-600">₹{product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Age - Revamped */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-gray-800 mb-4">Adventure by Age</h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">Find the perfect gear tailored exactly for their developmental milestones and style preferences.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Link to={`/shop?age=${AgeGroup.Baby}`} className="group p-1 bg-gradient-to-br from-blue-300 to-blue-500 rounded-[3rem] shadow-xl hover:shadow-blue-200 transition-all">
              <div className="bg-white rounded-[2.9rem] p-4 h-full">
                <div className="rounded-[2.5rem] overflow-hidden h-64 mb-6">
                  <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-2xl font-black text-blue-600 mb-2">Tiny Explorers</h3>
                <p className="text-gray-500 font-bold mb-4">Ages 0-5</p>
                <span className="inline-block bg-blue-50 text-blue-600 font-bold px-6 py-2 rounded-full">Explore</span>
              </div>
            </Link>
            <Link to={`/shop?age=${AgeGroup.Child}`} className="group p-1 bg-gradient-to-br from-pink-300 to-pink-500 rounded-[3rem] shadow-xl hover:shadow-pink-200 transition-all">
              <div className="bg-white rounded-[2.9rem] p-4 h-full">
                <div className="rounded-[2.5rem] overflow-hidden h-64 mb-6">
                  <img src="https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-2xl font-black text-pink-600 mb-2">School Heroes</h3>
                <p className="text-gray-500 font-bold mb-4">Ages 6-10</p>
                <span className="inline-block bg-pink-50 text-pink-600 font-bold px-6 py-2 rounded-full">Explore</span>
              </div>
            </Link>
            <Link to={`/shop?age=${AgeGroup.Teen}`} className="group p-1 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-[3rem] shadow-xl hover:shadow-yellow-200 transition-all">
              <div className="bg-white rounded-[2.9rem] p-4 h-full">
                <div className="rounded-[2.5rem] overflow-hidden h-64 mb-6">
                  <img src="https://images.unsplash.com/photo-1491013516836-7ad643eead76?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-2xl font-black text-yellow-600 mb-2">Trend Setters</h3>
                <p className="text-gray-500 font-bold mb-4">Ages 11-15</p>
                <span className="inline-block bg-yellow-50 text-yellow-600 font-bold px-6 py-2 rounded-full">Explore</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
