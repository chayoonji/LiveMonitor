import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordComponent = () => {
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/reset-password', { userId, newPassword });

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

  // 인라인 스타일 정의
  const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // 수평 중앙 정렬
    justifyContent: 'center', // 수직 중앙 정렬
    height: '100vh', // 뷰포트 높이의 100%
    padding: '20px',
  };

  const titleStyle = {
    marginBottom: '40px', // 제목과 다른 요소 간의 간격
    fontSize: '32px', // 제목 글자 크기 증가
    fontWeight: 'bold', // 제목 두께
    color: 'white', // 제목 색상
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '350px', // 폼 너비 증가
  };

  const inputStyle = {
    marginBottom: '20px', // 입력 요소 간의 간격 증가
    padding: '15px', // 입력 요소 내부 여백 증가
    border: '1px solid #ccc', // 테두리 색상
    borderRadius: '4px', // 테두리 모서리 둥글게
    fontSize: '18px', // 글자 크기 증가
  };

  const buttonStyle = {
    padding: '15px', // 버튼 내부 여백 증가
    border: 'none', // 테두리 제거
    borderRadius: '4px', // 버튼 모서리 둥글게
    backgroundColor: '#007bff', // 버튼 배경 색상
    color: 'white', // 버튼 글자 색상
    fontSize: '18px', // 버튼 글자 크기 증가
    cursor: 'pointer', // 커서 모양 변경
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3', // 버튼 호버 시 색상 변경
  };

  return (
    <div className="main-container">
      <div style={mainContainerStyle}>
        <h2 style={titleStyle}>비밀번호 재설정</h2> {/* 제목 스타일 추가 */}
        <form onSubmit={handleResetPassword} style={formStyle}>
          <input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            비밀번호 재설정
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
