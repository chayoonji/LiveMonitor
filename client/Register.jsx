import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  // 상태 변수 정의: email과 password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 동작 방지

    try {
      // 서버로 사용자 정보를 전송하여 등록 요청
      const response = await axios.post("http://localhost:3001/register", {
        email,
        password,
      });
      alert("User registered successfully"); // 성공 알림
    } catch (error) {
      alert("Error registering user"); // 실패 알림
    }
  };

  return (
    <div className="login-wrapper">
      <h2>Register</h2>
      {/* 회원가입 폼 */}
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
        {/* 회원가입 버튼 */}
        <div className="button-container">
          <input type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default Register;
