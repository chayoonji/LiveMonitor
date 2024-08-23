// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth(); // 인증 상태를 확인하는 로직
  
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
