import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // 로딩 중에는 로딩 메시지를 표시
  }

  if (!isAuthenticated) {
    // 인증되지 않은 경우, /guide 페이지로 리디렉션
    return <Navigate to="/guide" state={{ from: location }} replace />;
  }

  // 인증된 경우, 자식 컴포넌트를 렌더링
  return children;
};

export default PrivateRoute;
