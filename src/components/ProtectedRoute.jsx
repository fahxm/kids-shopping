import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    // Simple check: User must be logged in AND have the name 'Admin'
    // In a real app, you would check user.isAdmin from the database
    if (!user || user.name !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
