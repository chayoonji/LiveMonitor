import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  // 상태 변수 정의: email과 password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 동작 방지

    try {
      // 서버로 로그인 요청을 보냄
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      alert("Logged in successfully"); // 성공 알림
    } catch (error) {
      alert("Error logging in"); // 실패 알림
    }
  };

  return (
    <div className="login-wrapper">
      <h2>Login</h2>
      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} id="login-form">
        {/* 이메일 입력 필드 */}
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // 입력 값 변경 핸들러
        />
        {/* 비밀번호 입력 필드 */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 입력 값 변경 핸들러
        />
        {/* 로그인 버튼 */}
        <div className="button-container">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
