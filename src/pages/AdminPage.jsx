import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: 'Toys',
        ageRange: '3-5',
        imageUrl: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.products.create(formData);
            setMessage('Product Created Successfully! 🎉');
            setTimeout(() => {
                navigate('/shop');
            }, 2000);
        } catch (error) {
            setMessage('Error creating product 😢');
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-gray-800 mb-8">Admin Dashboard</h1>

            <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-blue-600">Add New Product</h2>

                {message && (
                    <div className={`p-4 mb-6 rounded-xl font-bold text-center ${message.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Product Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white transition"
                            placeholder="e.g. Super Fast Race Car"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white transition"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white transition"
                            >
                                <option>Toys</option>
                                <option>Clothing</option>
                                <option>Books</option>
                                <option>Accessories</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Age Range</label>
                        <select
                            name="ageRange"
                            value={formData.ageRange}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white transition"
                        >
                            <option value="0-1">0-1 Years</option>
                            <option value="2-5">2-5 Years</option>
                            <option value="6-10">6-10 Years</option>
                            <option value="11-15">11-15 Years</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white transition"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white transition"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition transform active:scale-95"
                    >
                        Create Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPage;
