import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  // 상태 변수 정의: email, password, name, companyEmail, verificationCode, isVerified
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false); // 이메일 인증 여부
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // 회원가입 성공 여부

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 동작 방지

    if (!isVerified) {
      alert("Please verify your company email first"); // 인증이 완료되지 않은 경우 알림
      return;
    }

    try {
      // 서버로 사용자 정보를 전송하여 등록 요청
      await axios.post("http://localhost:3001/register", {
        name,
        email,
        companyEmail,
        password,
        verificationCode,
      });
      setRegistrationSuccess(true); // 회원가입 성공 상태 업데이트
      alert("User registered successfully"); // 성공 알림
    } catch (error) {
      alert("Error registering user"); // 실패 알림
    }
  };

  // 인증번호 전송 핸들러
  const handleSendVerificationCode = async () => {
    try {
      // 서버로 회사 이메일을 전송하여 인증 코드 요청
      await axios.post("http://localhost:3001/verify-company-email", {
        companyEmail,
      });
      alert("Verification code sent successfully"); // 성공 알림
    } catch (error) {
      alert("Error sending verification code"); // 실패 알림
    }
  };

  // 인증번호 확인 핸들러
  const handleVerifyCode = async () => {
    try {
      // 서버로 인증 코드를 전송하여 확인 요청
      const response = await axios.post("http://localhost:3001/verify-code", {
        companyEmail,
        verificationCode,
      });
      if (response.data.success) {
        setIsVerified(true); // 인증 완료 상태 업데이트
        alert("Company email verified successfully"); // 성공 알림
      } else {
        alert("Invalid verification code"); // 실패 알림
      }
    } catch (error) {
      alert("Error verifying code"); // 실패 알림
    }
  };

  // 스타일 정의
  const inputStyle = { width: "100%", marginBottom: "20px", height: "40px" };
  const buttonStyle = {
    marginLeft: "10px",
    height: "40px",
    marginTop: "-10px",
  };
  const reducedMarginStyle = {
    width: "100%",
    marginBottom: "10px",
    height: "40px",
  };
  const borderRadiusStyle = { borderRadius: "5px" };

  if (registrationSuccess) {
    // 회원가입 성공한 경우 페이지를 새로고침하여 회원가입 페이지를 다시 표시
    window.location.reload();
  }

  return (
    <div className="login-wrapper">
      <h2>Register</h2>
      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit} id="login-form">
        {/* 이름 입력 필드 */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        {/* 이메일 입력 필드 */}
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        {/* 회사 이메일 입력 필드 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            name="companyEmail"
            placeholder="Company Email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            style={{ ...reducedMarginStyle, ...borderRadiusStyle }}
          />
          {/* 인증 버튼 */}
          <button
            type="button"
            onClick={handleSendVerificationCode}
            style={{ ...buttonStyle, ...borderRadiusStyle }}
          >
            인증번호 전송
          </button>
        </div>
        {/* 인증번호 입력 필드 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <input
            type="text"
            name="verificationCode"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ ...reducedMarginStyle, ...borderRadiusStyle }}
          />
          {/* 인증번호 확인 버튼 */}
          <button
            type="button"
            onClick={handleVerifyCode}
            style={{ ...buttonStyle, ...borderRadiusStyle }}
          >
            인증번호 확인
          </button>
        </div>
        {/* 비밀번호 입력 필드 */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={reducedMarginStyle}
        />
        {/* 회원가입 버튼 */}
        <div className="button-container">
          <input type="submit" value="Register" style={{ height: "40px" }} />
        </div>
      </form>
    </div>
  );
};

export default Register;
