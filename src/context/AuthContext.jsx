import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('kids_world_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, name) => {
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      orderHistory: []
    };
    setUser(newUser);
    localStorage.setItem('kids_world_user', JSON.stringify(newUser));
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
    <AuthContext.Provider value={{ user, login, logout, addOrder, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
