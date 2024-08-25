import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth(); // 로딩 상태와 인증 상태를 가져옴

  if (loading) {
    // 로딩 중에는 아무 것도 렌더링하지 않거나 로딩 스피너를 보여줌
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace={true} />;
};

export default PrivateRoute;