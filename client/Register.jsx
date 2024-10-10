import React, { useState } from 'react';
import axios from 'axios';

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
  const [idCheckResultStyle, setIdCheckResultStyle] = useState({});

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
        setIdCheckResultStyle({ color: 'red' });
      } else {
        setIdCheckResult('사용 가능한 아이디입니다');
        setIdCheckResultStyle({ color: 'green' });
      }
    } catch (error) {
      alert('아이디 중복 체크에 문제가 있습니다.');
    }
  };

  const inputStyle = {
    width: '100%', // 100% 너비
    maxWidth: '400px', // 최대 너비를 400px로 설정
    marginBottom: '15px',
    height: '50px', // 높이를 키움
    padding: '12px', // 패딩을 키움
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '18px', // 글씨 크기를 키움
  };

  const buttonStyle = {
    marginLeft: '10px',
    height: '50px', // 버튼 높이를 통일
    padding: '0 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px', // 버튼 글씨 크기를 키움
    transition: 'background-color 0.3s ease',
  };

  const hoverButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#0056b3',
  };

  if (registrationSuccess) {
    window.location.reload();
  }

  return (
    <div className="main-container" style={{ padding: '20px' }}>
      <div className="login-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px' }}>회원가입</h2>
        <form onSubmit={handleSubmit} id="login-form">
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          {/* 아이디 입력란과 버튼을 동일한 행에 배치 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input
              type="text"
              name="userId"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={inputStyle} // 동일한 입력 스타일 적용
            />
            <button
              type="button"
              onClick={handleCheckDuplicate}
              style={buttonStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
            >
              아이디 중복 체크
            </button>
          </div>
          <span style={idCheckResultStyle}>{idCheckResult}</span>
          {/* 회사 이메일 입력란과 버튼을 동일한 행에 배치 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input
              type="text"
              name="companyEmail"
              placeholder="회사 이메일 주소"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              style={inputStyle} // 동일한 입력 스타일 적용
            />
            <button
              type="button"
              onClick={handleSendVerificationCode}
              style={buttonStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
            >
              인증 코드 메일 전송
            </button>
          </div>
          {/* 인증 코드 입력란과 버튼을 동일한 행에 배치 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input
              type="text"
              name="verificationCode"
              placeholder="인증 코드 입력"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={inputStyle} // 동일한 입력 스타일 적용
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              style={buttonStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
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
            style={inputStyle}
          />
          {passwordError && <p style={{ color: 'red', fontSize: '16px' }}>{passwordError}</p>}
          <div className="button-container" style={{ textAlign: 'center' }}>
            <input
              type="submit"
              value="회원가입"
              style={{
                height: '50px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#007bff',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px', // 글씨 크기를 키움
                transition: 'background-color 0.3s ease',
                width: '100%', // 버튼 너비를 100%로 조정
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
