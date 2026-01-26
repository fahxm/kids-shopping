import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { user } = useAuth();
  if (!user || user.orderHistory.length === 0) return <div className="text-center py-20"><h2 className="text-2xl font-bold">No orders yet!</h2></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>
      {user.orderHistory.map(order => (
        <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border">
          <div className="flex justify-between border-b pb-4 mb-4 font-bold">
            <span>Order #{order.id}</span>
            <span className="text-blue-600">${order.total.toFixed(2)}</span>
          </div>
          {order.items.map(item => (
            <div key={item.id} className="text-gray-600">{item.title} x {item.quantity}</div>
          ))}
          <div className="mt-4 text-green-600 font-bold">{order.status}</div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
