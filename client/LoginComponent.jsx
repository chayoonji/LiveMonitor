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
      const response = await axios.post('http://localhost:3002/login', {
        userId,
        password,
      });

      // 로그인 성공 시, 클라이언트의 로그인 상태를 업데이트
      login(userId); // userId를 Context에 저장
      navigate('/guide'); // 로그인 후 guide 페이지로 리다이렉트
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div className="main-container">
      <div className="login-wrapper">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit} id="login-form">
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-container">
            <input type="submit" value="로그인" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
