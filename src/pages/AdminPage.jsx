import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [stats, setStats] = useState({ products: 0, orders: 0, users: 0 });

    // Data States
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '', price: '', description: '', category: 'Toys', ageRange: '3-5', imageUrl: '', stock: 10
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'products') {
                const data = await api.products.getAll();
                setProducts(data);
                setStats(prev => ({ ...prev, products: data.length }));
            } else if (activeTab === 'orders') {
                const data = await api.admin.getAllOrders();
                setOrders(data);
                setStats(prev => ({ ...prev, orders: data.length }));
            } else if (activeTab === 'users') {
                const data = await api.users.getAll();
                setUsers(data);
                setStats(prev => ({ ...prev, users: data.length }));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.admin.deleteProduct(id);
                fetchData(); // Refresh list
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const handleEditClick = (product) => {
        setFormData({
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            ageRange: product.ageRange,
            imageUrl: product.imageUrl,
            stock: product.stock || 10
        });
        setEditingId(product._id || product.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData({ title: '', price: '', description: '', category: 'Toys', ageRange: '3-5', imageUrl: '', stock: 10 });
        setEditingId(null);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.admin.updateProduct(editingId, formData);
                setMessage('Product Updated Successfully!');
            } else {
                await api.products.create(formData);
                setMessage('Product Created Successfully!');
            }
            setFormData({ title: '', price: '', description: '', category: 'Toys', ageRange: '3-5', imageUrl: '', stock: 10 });
            setEditingId(null);
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage(editingId ? 'Error updating product' : 'Error creating product');
        }
    };

    const [selectedUserOrders, setSelectedUserOrders] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const handleViewOrders = async (userId) => {
        try {
            const orders = await api.admin.getUserOrders(userId);
            setSelectedUserOrders(orders);
            setShowOrderModal(true);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            alert('Error fetching user orders: ' + (error.response?.data?.message || error.message));
        }
    };

    const OrderModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">User Order History</h3>
                    <button onClick={() => setShowOrderModal(false)} className="text-gray-500 hover:text-black font-bold text-xl">&times;</button>
                </div>
                {selectedUserOrders && selectedUserOrders.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Order ID</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Total</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedUserOrders.map(o => (
                                <tr key={o._id} className="border-b">
                                    <td className="p-2 text-sm text-gray-500">{o._id}</td>
                                    <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td className="p-2 font-bold">₹{o.totalPrice}</td>
                                    <td className="p-2"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Processing</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center py-4">No orders found for this user.</p>
                )}
            </div>
        </div>
    );

    // Render Helpers
    const renderProducts = () => (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                {message && <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="p-2 border rounded" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <input className="p-2 border rounded" placeholder="Price" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    <select className="p-2 border rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        <option>Toys</option><option>Clothing</option><option>Books</option><option>Accessories</option>
                    </select>
                    <select className="p-2 border rounded" value={formData.ageRange} onChange={e => setFormData({ ...formData, ageRange: e.target.value })}>
                        <option value="0-1">0-1 Years</option><option value="2-5">2-5 Years</option><option value="6-10">6-10 Years</option><option value="11-15">11-15 Years</option>
                    </select>
                    <input className="p-2 border rounded md:col-span-2" placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                    <textarea className="p-2 border rounded md:col-span-2" placeholder="Description" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Product List ({products.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Image</th>
                                <th className="p-2">Title</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Category</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id} className="border-b hover:bg-gray-50">
                                    <td className="p-2"><img src={p.imageUrl} alt={p.title} className="w-10 h-10 object-cover rounded" /></td>
                                    <td className="p-2 font-medium">{p.title}</td>
                                    <td className="p-2">₹{p.price}</td>
                                    <td className="p-2">{p.category}</td>
                                    <td className="p-2 space-x-2">
                                        <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700">Edit</button>
                                        <button onClick={() => handleDeleteProduct(p._id || p.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">All Orders ({orders.length})</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">User</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o._id} className="border-b">
                                <td className="p-3 text-sm text-gray-500">{o._id}</td>
                                <td className="p-3 font-medium">{o.user?.name || 'Unknown'}</td>
                                <td className="p-3 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                                <td className="p-3 font-bold">₹{o.totalPrice}</td>
                                <td className="p-3"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processing</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Create New Admin User</h3>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const name = e.target.name.value;
                    const email = e.target.email.value;
                    const password = e.target.password.value;
                    try {
                        await api.users.create({ name, email, password, role: 'admin' });
                        alert('Admin User Created Successfully!');
                        e.target.reset();
                        fetchData();
                    } catch (error) {
                        alert(error.response?.data?.message || 'Error creating user');
                    }
                }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="name" className="p-2 border rounded" placeholder="Full Name" required />
                    <input name="email" type="email" className="p-2 border rounded" placeholder="Email Address" required />
                    <input name="password" type="password" className="p-2 border rounded" placeholder="Password" required />
                    <button type="submit" className="md:col-span-3 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-bold">Create Admin</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Registered Users ({users.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Joined</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b">
                                    <td className="p-3 font-medium">{u.name}</td>
                                    <td className="p-3 text-gray-600">{u.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {u.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <button onClick={() => handleViewOrders(u._id)} className="text-blue-500 hover:text-blue-700 font-bold mr-3">
                                            Orders
                                        </button>
                                        {u.role !== 'admin' && (
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Are you sure you want to delete this user?')) {
                                                        try {
                                                            await api.users.delete(u._id);
                                                            fetchData();
                                                        } catch (error) {
                                                            alert('Error deleting user');
                                                        }
                                                    }
                                                }}
                                                className="text-red-500 hover:text-red-700 font-bold"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showOrderModal && <OrderModal />}
        </div>
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-gray-800">Dashboard Overview</h1>
            </div>

            {/* Hidden Tabs Logic for Sidebar Control */}
            <div className="hidden">
                <button id="tab-products" onClick={() => setActiveTab('products')}></button>
                <button id="tab-orders" onClick={() => setActiveTab('orders')}></button>
                <button id="tab-users" onClick={() => setActiveTab('users')}></button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading data...</div>
            ) : (
                <>
                    {activeTab === 'products' && renderProducts()}
                    {activeTab === 'orders' && renderOrders()}
                    {activeTab === 'users' && renderUsers()}
                </>
            )}
        </div>
    );
};

export default AdminPage;

