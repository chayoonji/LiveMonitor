import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import './LoginComponent.css'; // 스타일 파일 분리

const LoginComponent = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 로그인 요청
      const response = await axios.post('http://localhost:3002/login', {
        userId,
        password,
      });

      // 로그인 성공 시, Context의 login 함수에 userId와 password를 전달
      if (response.data.success) {
        login(userId, password); // 비밀번호도 함께 전달
        navigate('/guide'); // 로그인 후 guide 페이지로 리다이렉트
      } else {
        alert('로그인 실패: 잘못된 아이디 또는 비밀번호');
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다');
      console.error('로그인 오류:', error);
    }
  };

  return (
    <div
      className="main-container
    "
    >
      <div className="login-container">
        <div className="breadcrumb"></div>
        <div className="login-title">
          <h2>로그인</h2>
          <p></p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <h3>아이디/비밀번호</h3>
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        <div className="helper-links">
          <Link to="/find-user-id" className="helper-link">
            아이디 찾기
          </Link>
          <span className="separator">|</span>
          <Link to="/reset-password" className="helper-link">
            비밀번호 재설정
          </Link>
          <span className="separator">|</span>
          <Link to="/register" className="helper-link">
            회원가입
          </Link>
        </div>
        <div className="login-info">
          <p>
            로그인을 해야 프로그램 페이지가 활성화됩니다.<br></br> 아이디가
            없다면 회원가입을 해주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
