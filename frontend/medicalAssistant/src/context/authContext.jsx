import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Backend API URL (Replace with your actual backend endpoint)
const API_BASE_URL = "http://localhost:3000";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app loads
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "undefined") {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      // Clear the invalid data
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // **Login function** - Updated to handle server response format
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      console.log("Login response:", data);

      // Store the user data - assuming the whole response object IS the user
      // This is the key change from the previous version
      const userData = data; // Instead of data.user

      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // **Register function**
  const signup = async (username, password, gender, type, name) => {
    try {
      console.log('Signup Request Data:', { username, password, gender, type, name });

      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, gender, type, name })
      });
      console.log('Response status:', res.status);
      console.log('Response headers:', [...res.headers.entries()]);

      // Get the complete response text
      const responseText = await res.text();
      console.log('Raw response:', responseText);

      if (!res.ok) {
        let errorMessage = 'Failed to register';

        // Try to parse the response as JSON if possible
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Parsed error data:', errorData);
        } catch (parseError) {
          console.error('Could not parse error response as JSON:', responseText);
        }

        throw new Error(errorMessage);
      }

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse success response:', responseText);
        return { success: true, raw: responseText };
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // **Logout function**
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};