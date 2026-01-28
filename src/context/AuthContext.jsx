import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('kids_world_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    setUser(data);
    localStorage.setItem('kids_world_user', JSON.stringify(data));
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
    <AuthContext.Provider value={{ user, login, signup, logout, addOrder, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
