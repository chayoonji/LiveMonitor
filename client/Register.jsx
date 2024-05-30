import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert("Please verify your company email first");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/register", {
        name,
        email,
        companyEmail,
        password,
      });
      alert("User registered successfully");
    } catch (error) {
      alert("Error registering user");
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      await axios.post("http://localhost:3001/verify-company-email", {
        companyEmail,
      });
      alert("Verification code sent to your company email");
    } catch (error) {
      alert("Error sending verification code");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:3001/verify-code", {
        companyEmail,
        verificationCode,
      });
      if (response.data.success) {
        setIsVerified(true);
        alert("Company email verified successfully");
      } else {
        alert("Invalid verification code");
      }
    } catch (error) {
      alert("Error verifying code");
    }
  };

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

  return (
    <div className="login-wrapper">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} id="login-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
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
          <button
            type="button"
            onClick={handleSendVerificationCode}
            style={{ ...buttonStyle, ...borderRadiusStyle }}
          >
            인증번호 전송
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
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ ...reducedMarginStyle, ...borderRadiusStyle }}
          />
          <button
            type="button"
            onClick={handleVerifyCode}
            style={{ ...buttonStyle, ...borderRadiusStyle }}
          >
            인증번호 확인
          </button>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={reducedMarginStyle}
        />
        <div className="button-container">
          <input type="submit" value="Register" style={{ height: "40px" }} />
        </div>
      </form>
    </div>
  );
};

export default Register;
