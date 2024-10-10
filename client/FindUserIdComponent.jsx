import React, { useState } from 'react';
import axios from 'axios';

const FindUserIdComponent = () => {
  const [name, setName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [userId, setUserId] = useState('');

  const handleFindUserId = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/find-user-id', { name, companyEmail });
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

  // 인라인 스타일 정의
  const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // 수평 중앙 정렬
    justifyContent: 'center', // 수직 중앙 정렬
    height: '100vh', // 뷰포트 높이의 100%
    padding: '20px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '350px', // 폼 너비 증가
  };

  const inputStyle = {
    marginBottom: '20px', // 입력 요소 간의 간격 증가
    padding: '20px', // 입력 요소 내부 여백 증가
    border: '1px solid #ccc', // 테두리 색상
    borderRadius: '4px', // 테두리 모서리 둥글게
    fontSize: '20px', // 글자 크기 증가
  };

  const buttonStyle = {
    padding: '20px', // 버튼 내부 여백 증가
    border: 'none', // 테두리 제거
    borderRadius: '4px', // 버튼 모서리 둥글게
    backgroundColor: '#007bff', // 버튼 배경 색상
    color: 'white', // 버튼 글자 색상
    fontSize: '20px', // 버튼 글자 크기 증가
    cursor: 'pointer', // 커서 모양 변경
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3', // 버튼 호버 시 색상 변경
  };

  const userIdResultStyle = {
    marginTop: '30px', // 결과 메시지와 폼 간의 간격 증가
    fontWeight: 'bold', // 결과 메시지 굵게
    fontSize: '24px', // 결과 메시지 글자 크기 증가
    marginBottom: '10px', // 아이디 결과 메시지와 다른 요소 간의 간격 추가
  };

  const titleStyle = {
    marginBottom: '40px', // 제목과 다른 요소 간의 간격 추가
    fontSize: '28px', // 제목 글자 크기 증가
  };

  return (
    <div className="main-container">
      <div style={mainContainerStyle}>
        <h2 style={titleStyle}>아이디 찾기</h2>
        <form onSubmit={handleFindUserId} style={formStyle}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="회사 이메일"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            아이디 찾기
          </button>
        </form>
        {userId && <p style={userIdResultStyle}>찾은 아이디: {userId}</p>}
      </div>
    </div>
  );
};

export default FindUserIdComponent;
