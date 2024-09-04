import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // 로딩 중에는 로딩 스피너를 보여줌
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;