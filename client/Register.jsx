import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [userId, setUserId] = useState(""); 
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [idCheckResult, setIdCheckResult] = useState("");
  const [passwordError, setPasswordError] = useState(""); // 패스워드 에러 메시지 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 패스워드 유효성 검사: 최소 8자, 숫자, 영문, 특수문자 포함
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      // 에러 메시지 설정
      if (!/(?=.*[a-zA-Z])/.test(password)) {
        setPasswordError("영문자를 포함해야 합니다");
      } else if (!/(?=.*\d)/.test(password)) {
        setPasswordError("숫자를 포함해야 합니다");
      } else if (!/(?=.*[@$!%*?&])/.test(password)) {
        setPasswordError("특수문자를 포함해야 합니다");
      } else if (password.length < 8) {
        setPasswordError("비밀번호는 8자리 이상이어야 합니다");
      }
      return;
    }

    setPasswordError(""); // 에러가 없으면 초기화

    if (!isVerified) {
      alert("회사 이메일 인증부터 먼저 해주세요."); 
      return;
    }

    try {
      await axios.post("http://localhost:3002/register", {
        name,
        userId,
        companyEmail,
        password,
        verificationCode,
      });
      setRegistrationSuccess(true);
      alert("회원가입이 완료되었습니다");
    } catch (error) {
      alert("회원가입에 실패했습니다");
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      await axios.post("http://localhost:3002/verify-company-email", {
        companyEmail,
      });
      alert("인증 코드 메일 전송에 성공했습니다");
    } catch (error) {
      alert("인증 코드 메일 전송에 실패했습니다");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:3002/verify-code", {
        companyEmail,
        verificationCode,
      });
      if (response.data.success) {
        setIsVerified(true);
        alert("회사 이메일 인증에 성공했습니다");
      } else {
        alert("회사 이메일 인증에 실패했습니다");
      }
    } catch (error) {
      alert("인증 코드가 잘못되었습니다");
    }
  };

  const handleCheckDuplicate = async () => {
    try {
      const response = await axios.post("http://localhost:3002/check-duplicate", {
        userId,
      });
      if (response.data.exists) {
        setIdCheckResult("이미 사용중인 아이디입니다");
        setIdCheckResultStyle({ color: "red" });
      } else {
        setIdCheckResult("사용 가능한 아이디입니다");
        setIdCheckResultStyle({ color: "green" });
      }
    } catch (error) {
      alert("아이디 중복 체크에 문제가 있습니다.");
    }
  };

  const [idCheckResultStyle, setIdCheckResultStyle] = useState({});

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
    window.location.reload();
  }

  return (
    <div className="login-wrapper">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} id="login-form">
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          name="userId"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={handleCheckDuplicate}
          style={{ ...buttonStyle, ...borderRadiusStyle }}
        >
          아이디 중복 체크
        </button>
        <span style={idCheckResultStyle}>{idCheckResult}</span>
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
            placeholder="회사 이메일 주소"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            style={{ ...reducedMarginStyle, ...borderRadiusStyle }}
          />
          <button
            type="button"
            onClick={handleSendVerificationCode}
            style={{ ...buttonStyle, ...borderRadiusStyle }}
          >
            인증 코드 메일 전송
          </button>
        </div>
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
            placeholder="인증 코드 입력"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ ...reducedMarginStyle, ...borderRadiusStyle }}
          />
          <button
            type="button"
            onClick={handleVerifyCode}
            style={{ ...buttonStyle, ...borderRadiusStyle }}
          >
           입력한 인증 코드 확인
          </button>
        </div>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={reducedMarginStyle}
        />
        {/* 패스워드 에러 메시지 표시 */}
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        <div className="button-container">
          <input type="submit" value="회원가입" style={{ height: "40px" }} />
        </div>
      </form>
    </div>
  );
};

export default Register;
