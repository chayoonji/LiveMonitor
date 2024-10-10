import React, { useState } from 'react';
import axios from 'axios';
import './FindUserIdComponent.css';

const FindUserIdComponent = () => {
  const [name, setName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [userId, setUserId] = useState('');

  const handleFindUserId = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/find-user-id', {
        name,
        companyEmail,
      });
      if (response.data.success) {
        setUserId(response.data.userId);
      } else {
        alert(response.data.message || '사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('사용자를 찾을 수 없습니다.');
      } else {
        alert('서버 오류가 발생했습니다.');
      }
      console.error('AxiosError:', error);
    }
  };

  return (
    <div className="main-container">
      <div className="find-user-container">
        <h2 className="find-user-title">아이디 찾기</h2>
        <form onSubmit={handleFindUserId} className="find-user-form">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="find-user-input"
          />
          <input
            type="email"
            placeholder="회사 이메일"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            required
            className="find-user-input"
          />
          <button type="submit" className="find-user-button">
            아이디 찾기
          </button>
        </form>
        {userId && <p className="user-id-result">찾은 아이디: {userId}</p>}
        <div className="helper-links">
          <a href="/login" className="helper-link">
            로그인
          </a>
          <span className="separator">|</span>
          <a href="/register" className="helper-link">
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default FindUserIdComponent;
