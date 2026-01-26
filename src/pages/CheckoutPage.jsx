import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user, addOrder } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '', city: '', zip: '',
    cardName: '', cardNumber: '', expiry: '', cvv: ''
  });

  if (!isAuthenticated) return <div className="text-center py-20"><button onClick={() => navigate('/login')}>Login to Checkout</button></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) return setStep(2);
    setLoading(true);
    const order = { id: Date.now(), items: [...cart], total: cartTotal, status: 'Processing', date: new Date().toLocaleDateString() };
    await api.orders.create(order);
    addOrder(order);
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8">
        <h2 className="text-3xl font-black">{step === 1 ? 'Shipping' : 'Payment'}</h2>
        {step === 1 ? (
          <div className="space-y-4">
            <input required placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 border rounded-xl" />
            <input required placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-4 border rounded-xl" />
          </div>
        ) : (
          <div className="space-y-4">
            <input required placeholder="Card Number" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} className="w-full p-4 border rounded-xl" />
          </div>
        )}
        <button type="submit" disabled={loading} className="w-full py-5 bg-blue-500 text-white font-bold rounded-full">
          {loading ? 'Processing...' : (step === 1 ? 'Next' : `Pay $${cartTotal.toFixed(2)}`)}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
