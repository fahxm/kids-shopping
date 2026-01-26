import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty!</h2>
        <Link to="/shop" className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Toy Box & Closet</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-6">
              <img src={item.imageUrl} className="w-24 h-24 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span className="font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
            <div className="flex justify-between text-2xl font-bold mb-6"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
            <Link to="/checkout" className="block w-full text-center bg-yellow-400 text-blue-900 font-bold py-4 rounded-full">Checkout Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
