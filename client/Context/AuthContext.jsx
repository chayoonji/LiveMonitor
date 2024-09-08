import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const authCookie = Cookies.get('isAuthenticated');
      const userId = Cookies.get('userId');

      if (authCookie === 'true' && userId) {
        try {
          const response = await axios.post('http://localhost:3002/check-admin-status', { userId });
          if (isMounted) {
            setIsAuthenticated(true);
            setIsAdmin(response.data.isAdmin);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (userId) => {
    try {
      const response = await axios.post('http://localhost:3002/login', { userId });
      if (response.data.success) {
        setIsAuthenticated(true);
        Cookies.set('isAuthenticated', 'true', { expires: 1 });
        Cookies.set('userId', userId, { expires: 1 });
        setIsAdmin(response.data.isAdmin);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    Cookies.remove('isAuthenticated');
    Cookies.remove('userId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);