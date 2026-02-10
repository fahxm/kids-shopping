import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-black tracking-tighter text-blue-400">ADMIN <span className="text-white">PANEL</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block px-4 py-3 rounded-xl hover:bg-gray-800 transition font-medium">
                         Dashboard
                    </Link>
                    <button
                        onClick={() => document.getElementById('tab-products').click()}
                        className="w-full text-left block px-4 py-3 rounded-xl hover:bg-gray-800 transition font-medium"
                    >
                         Products
                    </button>
                    <button
                        onClick={() => document.getElementById('tab-orders').click()}
                        className="w-full text-left block px-4 py-3 rounded-xl hover:bg-gray-800 transition font-medium"
                    >
                         Orders
                    </button>
                    <button
                        onClick={() => document.getElementById('tab-users').click()}
                        className="w-full text-left block px-4 py-3 rounded-xl hover:bg-gray-800 transition font-medium"
                    >
                         Users
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl transition font-bold"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
