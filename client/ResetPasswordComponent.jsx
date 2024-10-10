import React, { useState } from 'react';
import axios from 'axios';
import './ResetPasswordComponent.css';

const ResetPasswordComponent = () => {
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3002/reset-password',
        { userId, newPassword }
      );

      if (response.data.success) {
        alert('재설정 성공했습니다.'); // 성공 알림
        window.location.reload(); // 페이지 새로고침
      } else {
        alert(response.data.message); // 실패 메시지
      }
    } catch (error) {
      alert('비밀번호 재설정 중 오류가 발생했습니다.'); // 오류 알림
      console.error(error);
    }
  };

  return (
    <div className="main-container">
      <div className="reset-password-container">
        <h2 className="reset-password-title">비밀번호 재설정</h2>
        <form onSubmit={handleResetPassword} className="reset-password-form">
          <input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="reset-password-input"
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="reset-password-input"
          />
          <button type="submit" className="reset-password-button">
            비밀번호 재설정
          </button>
        </form>
        <div className="helper-links">
          <a href="/login" className="helper-link">
            로그인
          </a>
          <span className="separator">|</span>
          <a href="/register" className="helper-link">
            회원가입
          </a>
          <span className="separator">|</span>
          <a href="/find-user-id" className="helper-link">
            아이디 찾기
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
