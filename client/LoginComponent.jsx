import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

const LoginComponent = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/login', {
        userId,
        password,
      });
      login();
      navigate('/guide'); // 로그인 후 guide 페이지로 리다이렉트
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div className="login-wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} id="login-form">
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;
