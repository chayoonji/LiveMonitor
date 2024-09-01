import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트가 언마운트될 때 상태 업데이트를 방지하기 위한 플래그
    let isMounted = true;

    const initializeAuth = () => {
      const authCookie = Cookies.get('isAuthenticated');
      if (isMounted) {
        setIsAuthenticated(authCookie === 'true');
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (userId) => {
    setIsAuthenticated(true);
    Cookies.set('isAuthenticated', 'true', { expires: 1 });
    Cookies.set('userId', userId, { expires: 1 });
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove('isAuthenticated');
    Cookies.remove('userId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
