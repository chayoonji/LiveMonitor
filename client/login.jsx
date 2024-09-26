import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(true);  // 기본적으로 표시
  const [isUserIdRecovery, setIsUserIdRecovery] = useState(true);  // 기본적으로 표시
  const [verificationCode, setVerificationCode] = useState('');

  // 로그인 함수
  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', {
        userId,
        password,
      });
      if (response.status === 200) {
        alert('Login successful');
        // 로그인 성공 처리 로직 (예: 토큰 저장)
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  // 비밀번호 찾기 함수
  const handleFindPassword = async () => {
    try {
      const response = await axios.post('/find-password', {
        userId,
      });
      if (response.status === 200) {
        alert('Password reset verification code sent to your company email.');
      }
    } catch (error) {
      console.error('Error sending password reset code:', error);
      alert('Error sending password reset code');
    }
  };

  // 아이디 찾기 함수
  const handleFindUserId = async () => {
    try {
      const response = await axios.post('/find-userid', {
        companyEmail: email,
      });
      if (response.status === 200) {
        alert('User ID recovery verification code sent to your company email.');
      }
    } catch (error) {
      console.error('Error sending user ID recovery code:', error);
      alert('Error sending user ID recovery code');
    }
  };

  return (
    <div>
      {/* 로그인 폼 */}
      <h2>Login</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      {/* 비밀번호 찾기 */}
      <div>
        <h3>Find Password</h3>
        <input
          type="text"
          placeholder="Enter your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleFindPassword}>Send Verification Code</button>
      </div>

      {/* 아이디 찾기 */}
      <div>
        <h3>Find User ID</h3>
        <input
          type="text"
          placeholder="Enter your company email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleFindUserId}>Send Verification Code</button>
      </div>
    </div>
  );
};

export default Login;
