import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

//in this file even this refreshed the login user stays same 

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kids_world_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    setUser(data);
    localStorage.setItem('kids_world_user', JSON.stringify(data));
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await api.auth.signup(name, email, password);
    setUser(data);
    localStorage.setItem('kids_world_user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kids_world_user');
  };

  const addOrder = (order) => {
    if (user) {
      const updatedUser = {
        ...user,
        orderHistory: [order, ...user.orderHistory]
      };
      setUser(updatedUser);
      localStorage.setItem('kids_world_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, addOrder, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
