// client/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 쿠키에서 인증 상태를 읽어 로컬 상태를 초기화
    const authCookie = Cookies.get('isAuthenticated');
    setIsAuthenticated(authCookie === 'true');
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    Cookies.set('isAuthenticated', 'true', { expires: 1 });
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
