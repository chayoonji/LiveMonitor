import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(''); // userId 상태 추가

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const authCookie = Cookies.get('isAuthenticated');
      const userIdCookie = Cookies.get('userId');

      if (authCookie === 'true' && userIdCookie) {
        try {
          const response = await axios.post('#', { userId: userIdCookie });
          if (isMounted) {
            setIsAuthenticated(true);
            setIsAdmin(response.data.isAdmin);
            setUserId(userIdCookie); // 쿠키에서 userId 설정
          }
        } catch (error) {
          console.error('관리자인지 확인하는데 실패했습니다:', error);
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

  const login = async (newUserId) => {
    try {
      const response = await axios.post('http://localhost:3002/login', { userId: newUserId });
      if (response.data.success) {
        setIsAuthenticated(true);
        Cookies.set('isAuthenticated', 'true', { expires: 1 });
        Cookies.set('userId', newUserId, { expires: 1 });
        setUserId(newUserId); // 로그인 시 userId 설정
        setIsAdmin(response.data.isAdmin);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('로그인중에 오류가 발생했습니다:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const logout = async () => {
    try {
      // 데이터베이스 값 초기화 요청
      await axios.post('http://localhost:3002/reset-database-values');
      
      // 인증 및 상태 초기화
      setIsAuthenticated(false);
      setIsAdmin(false);
      Cookies.remove('isAuthenticated');
      Cookies.remove('userId');
      setUserId(''); // userId 초기화
      navigate('/login'); // 페이지 이동
    } catch (error) {
      console.error('로그아웃중에 오류가 발생했습니다:', error);
    }
  };
  

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuthenticatedFromCookie = Cookies.get('isAuthenticated');
      if (!isAuthenticatedFromCookie) {
        // 로그아웃 처리 및 데이터베이스 값 초기화
        await axios.post('http://localhost:3002/reset-database-values');
        logout(); // 로그아웃 시 userId 값도 초기화
      } else {
        // 새로고침 시 userId 초기화
        setUserId('');
      }
    };
  
    checkAuthStatus();
  }, []); // 페이지가 처음 로드되거나 새로고침될 때 실행
  
  
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, loading, login, logout, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
