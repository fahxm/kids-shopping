import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Load from Local Storage on Mount (for guests)
  useEffect(() => {
    const savedCart = localStorage.getItem('kids_world_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sync with Server on Login (Merge Strategy)
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAndMergeCart = async () => {
        try {
          const serverCart = await api.carts.get();
          let mergedCart = [...(serverCart || [])];

          // If we had local items before login, merge them in
          if (cart.length > 0) {
            cart.forEach(localItem => {
              const existingItemIndex = mergedCart.findIndex(i => i.id === localItem.id);
              if (existingItemIndex > -1) {
                // If item exists in both, sum the quantities
                mergedCart[existingItemIndex].quantity += localItem.quantity;
              } else {
                // Otherwise just add it
                mergedCart.push(localItem);
              }
            });
            // Update server immediately with the new merged state
            await api.carts.update(mergedCart);
          }

          setCart(mergedCart);
        } catch (error) {
          console.error("Failed to fetch/merge cart", error);
        }
      };
      fetchAndMergeCart();
    }
  }, [isAuthenticated]);

  // Save to Server + Local Storage on Change
  useEffect(() => {
    localStorage.setItem('kids_world_cart', JSON.stringify(cart));

    // Simple Debounce to prevent Race Conditions (frequent updates overwriting each other)
    const timeoutId = setTimeout(() => {
      if (isAuthenticated && cart.length > 0) {
        const saveToServer = async () => {
          try {
            await api.carts.update(cart);
          } catch (error) {
            console.error("Failed to save cart", error);
          }
        };
        saveToServer();
      }
    }, 1000); // Wait 1 second after last change before saving

    return () => clearTimeout(timeoutId);
  }, [cart, isAuthenticated]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    if (isAuthenticated) {
      api.carts.update([]);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
