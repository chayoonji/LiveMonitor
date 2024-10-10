import React, { useState } from 'react';
import axios from 'axios';
import './RegisterComponent.css';

const Register = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [idCheckResult, setIdCheckResult] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      if (!/(?=.*[a-zA-Z])/.test(password)) {
        setPasswordError('영문자를 포함해야 합니다');
      } else if (!/(?=.*\d)/.test(password)) {
        setPasswordError('숫자를 포함해야 합니다');
      } else if (!/(?=.*[@$!%*?&])/.test(password)) {
        setPasswordError('특수문자를 포함해야 합니다');
      } else if (password.length < 8) {
        setPasswordError('비밀번호는 8자리 이상이어야 합니다');
      }
      return;
    }

    setPasswordError('');

    if (!isVerified) {
      alert('회사 이메일 인증부터 먼저 해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:3002/register', {
        name,
        userId,
        companyEmail,
        password,
        verificationCode,
      });
      setRegistrationSuccess(true);
      alert('회원가입이 완료되었습니다');
    } catch (error) {
      alert('회원가입에 실패했습니다');
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      await axios.post('http://localhost:3002/verify-company-email', {
        companyEmail,
      });
      alert('인증 코드 메일 전송에 성공했습니다');
    } catch (error) {
      alert('인증 코드 메일 전송에 실패했습니다');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('http://localhost:3002/verify-code', {
        companyEmail,
        verificationCode,
      });
      if (response.data.success) {
        setIsVerified(true);
        alert('회사 이메일 인증에 성공했습니다');
      } else {
        alert('회사 이메일 인증에 실패했습니다');
      }
    } catch (error) {
      alert('인증 코드가 잘못되었습니다');
    }
  };

  const handleCheckDuplicate = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3002/check-duplicate',
        {
          userId,
        }
      );
      if (response.data.exists) {
        setIdCheckResult('이미 사용중인 아이디입니다');
      } else {
        setIdCheckResult('사용 가능한 아이디입니다');
      }
    } catch (error) {
      alert('아이디 중복 체크에 문제가 있습니다.');
    }
  };

  if (registrationSuccess) {
    window.location.reload();
  }

  return (
    <div className="main-container">
      <div className="register-container">
        <h2 className="register-title">회원가입</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="register-input"
          />
          <div className="input-group">
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="register-input"
            />
            <button
              type="button"
              onClick={handleCheckDuplicate}
              className="register-button"
            >
              아이디 중복 체크
            </button>
          </div>
          <span className="id-check-result">{idCheckResult}</span>
          <div className="input-group">
            <input
              type="text"
              name="companyEmail"
              placeholder="회사 이메일 주소"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="register-input"
            />
            <button
              type="button"
              onClick={handleSendVerificationCode}
              className="register-button"
            >
              인증 코드 메일 전송
            </button>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="verificationCode"
              placeholder="인증 코드 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="register-input"
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              className="register-button"
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
            className="register-input"
          />
          {passwordError && <p className="password-error">{passwordError}</p>}
          <button type="submit" className="register-submit-button">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
