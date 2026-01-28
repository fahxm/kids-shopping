import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.orders.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) return <div className="text-center py-20">Please log in to view orders.</div>;
  if (loading) return <div className="text-center py-20">Loading orders...</div>;
  if (orders.length === 0) return <div className="text-center py-20"><h2 className="text-2xl font-bold">No orders yet!</h2></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>
      {orders.map(order => (
        <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border">
          <div className="flex justify-between border-b pb-4 mb-4 font-bold">
            <span className="text-gray-500 text-sm">Order #{order._id}</span>
            <div className="text-right">
              <span className="block text-blue-600 text-xl">${order.totalPrice.toFixed(2)}</span>
              <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-gray-700">
                <div className="flex items-center gap-2">
                  <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded object-cover" />
                  <span>{item.title} (x{item.qty})</span>
                </div>
                <span>${item.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between">
            <span className="text-sm">Status: <span className="font-bold text-green-600">{order.isPaid ? 'Paid' : 'Processing'}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
