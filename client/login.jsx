import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 서버로 로그인 요청을 보냄
      const response = await axios.post('http://localhost:3002/login', {
        userId,
        password,
      });

      // 로그인 성공 시, 클라이언트의 로그인 상태를 업데이트
      login();
      alert('Logged in successfully');
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

export default Login;
