import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('reviews');
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '', name: '' });
  const [questionText, setQuestionText] = useState('');
  const [questionName, setQuestionName] = useState('');
  const [answerText, setAnswerText] = useState({});

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to submit a review');
    try {
      await api.products.addReview(id, reviewData);
      const res = await api.products.getById(id);
      setProduct(res);
      setReviewData({ rating: 5, comment: '', name: '' });
      alert('Review added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add review');
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to ask a question');
    try {
      await api.products.askQuestion(id, { question: questionText, name: questionName });
      const res = await api.products.getById(id);
      setProduct(res);
      setQuestionText('');
      setQuestionName('');
      alert('Question submitted!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to ask question');
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    try {
      await api.admin.answerQuestion(id, questionId, answerText[questionId]);
      const res = await api.products.getById(id);
      setProduct(res);
      setAnswerText(prev => ({...prev, [questionId]: ''}));
      alert('Answer submitted!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit answer');
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.products.getById(id).then(res => {
        setProduct(res);
        setLoading(false);
      }).catch(err => {
        console.error('Error fetching product:', err);
        setProduct(null);
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
          {product.additionalImages && product.additionalImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              {product.additionalImages.map((imgUrl, i) => (
                <div key={i} className="aspect-square bg-white rounded-2xl border-2 border-transparent hover:border-blue-400 cursor-pointer overflow-hidden opacity-60 hover:opacity-100 transition">
                  <img src={imgUrl} className="w-full h-full object-cover" alt={`${product.title} ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
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
              <div className="flex text-yellow-400 text-xl">
                {'★'.repeat(Math.round(product.rating || 0))}
                {'☆'.repeat(5 - Math.round(product.rating || 0))}
              </div>
              <span className="text-gray-400 font-bold">({(product.rating || 0).toFixed(1)} / 5.0 Rating • {product.numReviews || 0} Reviews)</span>
            </div>
          </div>

          <p className="text-2xl font-black text-blue-600">₹{product.price.toFixed(2)}</p>

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

      {/* Tabs Section */}
      <div className="mt-20">
        <div className="flex gap-8 border-b-2 border-gray-100 mb-8">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-2xl font-black transition-colors ${activeTab === 'reviews' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Reviews ({product.numReviews || 0})
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`pb-4 text-2xl font-black transition-colors ${activeTab === 'qa' ? 'text-pink-600 border-b-4 border-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Q&A ({(product.questions || []).length})
          </button>
        </div>

        {activeTab === 'reviews' && (
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-black text-gray-800 mb-6">Customer Reviews</h3>
              {(!product.reviews || product.reviews.length === 0) ? (
                <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-6">
                  {product.reviews.map((r, idx) => (
                    <div key={idx} className="bg-gray-50 p-6 rounded-3xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-800">{r.name}</span>
                        <div className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                      </div>
                      <p className="text-gray-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-blue-50 p-8 rounded-[3rem] h-fit">
              <h3 className="text-2xl font-black text-blue-900 mb-6">Write a Review</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-blue-900 font-bold mb-2">Rating</label>
                    <select className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400" value={reviewData.rating} onChange={e => setReviewData({...reviewData, rating: e.target.value})}>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Terrible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-blue-900 font-bold mb-2">Display Name</label>
                    <input type="text" required placeholder="How should we call you?" className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400" value={reviewData.name} onChange={e => setReviewData({...reviewData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-blue-900 font-bold mb-2">Your Review</label>
                    <textarea required rows="4" placeholder="What did you love about it?" className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400" value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition">Submit Review</button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-blue-900 font-bold mb-4">Please log in to share your thoughts.</p>
                  <Link to="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Log In</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-black text-gray-800 mb-6">Questions & Answers</h3>
              {(!product.questions || product.questions.length === 0) ? (
                <p className="text-gray-500 italic">No questions yet. Ask away!</p>
              ) : (
                <div className="space-y-6">
                  {product.questions.map((q) => (
                    <div key={q._id} className="bg-gray-50 p-6 rounded-3xl">
                      <div className="flex gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">Q</div>
                        <div>
                          <p className="font-bold text-gray-800">{q.question}</p>
                          <p className="text-xs text-gray-400 mt-1">Asked by {q.name}</p>
                        </div>
                      </div>
                      {q.answer ? (
                        <div className="flex gap-3 ml-6 mt-4">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600 shrink-0">A</div>
                          <div>
                            <p className="font-bold text-gray-700">{q.answer}</p>
                            <p className="text-xs text-pink-400 mt-1">Answered by Store Admin</p>
                          </div>
                        </div>
                      ) : (
                        user?.role === 'admin' ? (
                          <div className="ml-6 mt-4 flex gap-2">
                            <input type="text" placeholder="Type answer..." className="flex-1 p-2 rounded-lg border border-gray-200" value={answerText[q._id] || ''} onChange={e => setAnswerText({...answerText, [q._id]: e.target.value})} />
                            <button onClick={() => handleAnswerSubmit(q._id)} className="bg-pink-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-600">Reply</button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic ml-11 mt-2">Waiting for an answer...</p>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-pink-50 p-8 rounded-[3rem] h-fit">
              <h3 className="text-2xl font-black text-pink-900 mb-6">Ask a Question</h3>
              {user ? (
                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-pink-900 font-bold mb-2">Display Name</label>
                    <input type="text" required placeholder="Your name" className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-pink-400" value={questionName} onChange={e => setQuestionName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-pink-900 font-bold mb-2">Question</label>
                    <textarea required rows="4" placeholder="What do you want to know?" className="w-full p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-pink-400" value={questionText} onChange={e => setQuestionText(e.target.value)}></textarea>
                  </div>
                  <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-4 rounded-xl transition">Submit Question</button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-pink-900 font-bold mb-4">Please log in to ask a question.</p>
                  <Link to="/login" className="inline-block bg-pink-500 text-white px-8 py-3 rounded-full font-bold">Log In</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
