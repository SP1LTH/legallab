// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null); // Store the user object
  const [loading, setLoading] = useState(true); // Loading state to handle user fetching

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Fetch the user data using /me API endpoint
          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user); // Set user object from the response
          setIsLoggedIn(true);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          setIsLoggedIn(false);
          setUser(null); // Clear user if fetching failed
        }
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchUser(); // Fetch user on component mount
  }, []);

  const login = (userData, token) => {
    setIsLoggedIn(true);
    setUser(userData); // Set user after successful login
    localStorage.setItem('token', token); // Store the token in localStorage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null); // Clear user on logout
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, login, logout }}>
      {!loading && children} {/* Render children only when not loading */}
    </AuthContext.Provider>
  );
};
