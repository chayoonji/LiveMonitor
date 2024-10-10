import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

const LoginComponent = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 로그인 요청
      const response = await axios.post("http://localhost:3002/login", {
        userId,
        password,
      });

      // 로그인 성공 시, Context의 login 함수에 userId와 password를 전달
      if (response.data.success) {
        login(userId, password); // 비밀번호도 함께 전달
        navigate("/guide"); // 로그인 후 guide 페이지로 리다이렉트
      } else {
        alert("로그인 실패: 잘못된 아이디 또는 비밀번호");
      }
    } catch (error) {
      alert("로그인 중 오류가 발생했습니다");
      console.error("로그인 오류:", error);
    }
  };

  // 인라인 스타일 정의
  const mainContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // 수평 중앙 정렬
    justifyContent: "center", // 수직 중앙 정렬
    height: "100vh", // 뷰포트 높이의 100%
    padding: "20px",
  };

  const loginWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // 수평 중앙 정렬
    width: "400px", // 로그인 박스 너비 설정
    borderRadius: "8px", // 둥근 모서리
    padding: "40px", // 내부 여백 증가
  };

  const titleStyle = {
    marginBottom: "40px", // 제목과 다른 요소 간의 간격
    fontSize: "32px", // 제목 글자 크기 증가
    fontWeight: "bold", // 제목 두께
    color: "white", // 제목 색상
  };

  const inputStyle = {
    marginBottom: "20px", // 입력 요소 간의 간격 증가
    padding: "15px", // 입력 요소 내부 여백 증가
    border: "1px solid #ccc", // 테두리 색상
    borderRadius: "4px", // 테두리 모서리 둥글게
    fontSize: "18px", // 글자 크기 증가
    width: "100%", // 너비 100%
  };

  const buttonContainerStyle = {
    width: "100%", // 버튼 너비 100%
  };

  const buttonStyle = {
    padding: "15px", // 버튼 내부 여백 증가
    border: "none", // 테두리 제거
    borderRadius: "4px", // 버튼 모서리 둥글게
    backgroundColor: "#007bff", // 버튼 배경 색상
    color: "white", // 버튼 글자 색상
    fontSize: "18px", // 버튼 글자 크기 증가
    cursor: "pointer", // 커서 모양 변경
    width: "100%", // 버튼 너비 100%
    transition: "background-color 0.3s, box-shadow 0.3s", // 부드러운 전환 효과
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3", // 버튼 호버 시 색상 변경
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // 호버 시 그림자 효과 추가
  };

  const helperLinksStyle = {
    marginTop: "25px", // 로그인 버튼과의 간격
    display: "flex",
    justifyContent: "space-between", // 링크 사이의 간격을 균등하게
    width: "100%", // 전체 너비 사용
  };

  return (
    <div className="main-container">
      <div style={mainContainerStyle}>
        <div style={loginWrapperStyle}>
          <h2 style={titleStyle}>로그인</h2>
          <form onSubmit={handleSubmit} id="login-form">
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required // 필수 입력 항목으로 설정
              style={inputStyle}
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // 필수 입력 항목으로 설정
              style={inputStyle}
            />
            <div style={buttonContainerStyle}>
              <input
                type="submit"
                value="로그인"
                style={buttonStyle}
                onMouseOver={(e) => {
                  Object.assign(e.currentTarget.style, buttonHoverStyle);
                }}
                onMouseOut={(e) => {
                  Object.assign(e.currentTarget.style, buttonStyle);
                }}
              />
            </div>
          </form>
          <div style={helperLinksStyle}>
            <Link to="/find-user-id" className="helper-link">
              아이디 찾기
            </Link>
            <Link to="/reset-password" className="helper-link">
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
