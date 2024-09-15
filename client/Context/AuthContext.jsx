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
          const response = await axios.post('#', { userId });
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

  const logout = async () => {
    try {
      // 데이터베이스 초기화 요청
      await axios.post('http://localhost:3002/reset-database');
  
      // 상태 초기화
      setIsAuthenticated(false);
      setIsAdmin(false);
      Cookies.remove('isAuthenticated');
      Cookies.remove('userId');
      navigate('/login');
    } catch (error) {
      console.error('Error resetting database on logout:', error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
