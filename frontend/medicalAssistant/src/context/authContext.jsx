import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in when app loads
  useEffect(() => {
    // Check local storage for saved user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    // For a real application, this would be an API call
    // This is a simplified example for demonstration
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example validation
      if (email === 'test@example.com' && password === 'password123') {
        const user = { id: 1, email, name: 'Test User' };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Register function
  const register = async (name, email, password) => {
    // For a real application, this would be an API call
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example validation (in a real app you'd check if email exists)
      const user = { id: Date.now(), email, name };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Create the context value object
  const value = {
    currentUser,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};