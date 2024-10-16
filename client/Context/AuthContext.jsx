import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState(''); // 비밀번호 상태 추가

  useEffect(() => {
    let isMounted = true;
    let logoutTimer; // 로그아웃 타이머

    const initializeAuth = async () => {
      const authCookie = Cookies.get('isAuthenticated');
      const userIdCookie = Cookies.get('userId');

      if (authCookie === 'true' && userIdCookie) {
        try {
          const response = await axios.post('#', { userId: userIdCookie });
          if (isMounted) {
            setIsAuthenticated(true);
            setIsAdmin(response.data.isAdmin);
            setUserId(userIdCookie);
            // 자동 로그아웃 타이머 설정 (5분 = 300,000ms)
            logoutTimer = setTimeout(() => {
              // 관리자가 아닐 때만 로그아웃
              if (!response.data.isAdmin) {
                logout();
              }
            }, 300000); // 5분
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
      clearTimeout(logoutTimer); // 컴포넌트 언마운트 시 타이머 정리
    };
  }, []);

  const login = async (newUserId, newPassword) => {
    // 비밀번호를 매개변수로 추가
    try {
      const response = await axios.post('http://localhost:3002/login', {
        userId: newUserId,
        password: newPassword, // 비밀번호 포함
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        Cookies.set('isAuthenticated', 'true', { expires: 1 });
        Cookies.set('userId', newUserId, { expires: 1 });
        setUserId(newUserId);
        setIsAdmin(response.data.isAdmin);
        // 자동 로그아웃 타이머 설정 (5분 = 300,000ms)
        setTimeout(() => {
          // 관리자가 아닐 때만 로그아웃
          if (!response.data.isAdmin) {
            logout();
          }
        }, 300000); // 5분
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
      await axios.post('http://localhost:3002/reset-database-values');
      setIsAuthenticated(false);
      setIsAdmin(false);
      Cookies.remove('isAuthenticated');
      Cookies.remove('userId');
      setUserId('');
    } catch (error) {
      console.error('로그아웃중에 오류가 발생했습니다:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
        userId,
        setUserId,
        setPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
