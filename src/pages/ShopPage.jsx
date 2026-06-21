import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const ShopPage = () => {
  const { addToCart } = useCart();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Toys', 'Clothing', 'Accessories', 'Books', 'Footwear'];
  const genders = ['Boys', 'Girls', 'Unisex'];
  const ageGroups = ['0-1', '2-5', '6-10', '11-15'];

  const [filters, setFilters] = useState({
    category: queryParams.get('category') || 'All',
    gender: queryParams.get('gender') || 'All',
    age: queryParams.get('age') || 'All',
    search: queryParams.get('search') || ''
  });

  useEffect(() => {
    setLoading(true);

    api.products.getAll(filters)
      .then(res => {
        setProducts(res || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    setFilters({
      search: queryParams.get('search') || '',
      category: queryParams.get('category') || 'All',
      gender: queryParams.get('gender') || 'All',
      age: queryParams.get('age') || 'All'
    });
  }, [location.search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 space-y-10">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              Filters
            </h3>

            <div className="space-y-8">
              {/* Category */}
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Categories</h4>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {['All', ...categories].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, category: cat })}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filters.category === cat ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Gender</h4>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {['All', ...genders].map(g => (
                    <button
                      key={g}
                      onClick={() => setFilters({ ...filters, gender: g })}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filters.gender === g ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Groups */}
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Age Groups</h4>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {['All', ...ageGroups].map(age => (
                    <button
                      key={age}
                      onClick={() => setFilters({ ...filters, age: age })}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filters.age === age ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {age} Years
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setFilters({ category: 'All', gender: 'All', age: 'All', search: '' })}
              className="w-full mt-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-2xl transition"
            >
              Reset All
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-800">
                {filters.search ? `Magic for "${filters.search}"` : 'Everything We Have'}
              </h1>
              <p className="text-gray-400 font-bold mt-1">Found {products.length} special items</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-[2rem] h-[400px]"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full">
                  <Link to={`/product/${product.id}`} className="block relative h-64 overflow-hidden">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                  </Link>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-pink-500">{product.category}</span>
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Ages {product.ageRange}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="font-black text-2xl text-gray-800 mb-3 block group-hover:text-blue-500 transition-colors line-clamp-1">
                      {product.title}
                    </Link>
                    <p className="text-gray-400 text-sm font-medium mb-6 line-clamp-2">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-3xl font-black text-blue-600">
                        ₹{product.price ? Number(product.price).toFixed(2) : '0.00'}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg transition transform active:scale-90"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border-4 border-dashed border-gray-100">
              <h2 className="text-3xl font-black text-gray-800 mb-2">Nothing found in the Toybox!</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;