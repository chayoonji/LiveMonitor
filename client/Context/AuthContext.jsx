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

   // 로그아웃 함수
   const logout = async () => {
    try {
      await axios.post('http://localhost:3002/reset-database');
      setIsAuthenticated(false);
      setIsAdmin(false);
      Cookies.remove('isAuthenticated');
      Cookies.remove('userId');
      navigate('/login');
    } catch (error) {
      console.error('Error resetting database on logout:', error);
    }
  };

  // 새로고침 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuthenticatedFromCookie = Cookies.get('isAuthenticated');
      if (!isAuthenticatedFromCookie) {
        // 로그아웃 처리
        logout();
      }
    };

    checkAuthStatus();
  }, []); // 페이지가 처음 로드되거나 새로고침될 때 실행
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
