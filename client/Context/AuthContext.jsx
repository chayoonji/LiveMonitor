import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    // 쿠키에서 인증 상태를 읽어 로컬 상태를 초기화
    const authCookie = Cookies.get('isAuthenticated');
    setIsAuthenticated(authCookie === 'true');
    setLoading(false); // 인증 상태를 확인한 후 로딩 상태를 false로 설정
  }, []);

  const login = (userId) => {
    setIsAuthenticated(true);
    Cookies.set('isAuthenticated', 'true', { expires: 1 });
    Cookies.set('userId', userId, { expires: 1 }); // userId도 쿠키에 저장
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove('isAuthenticated');
    Cookies.remove('userId'); // 로그아웃 시 userId 쿠키 제거
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
