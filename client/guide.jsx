import React from 'react';
import { useAuth } from './Context/AuthContext'; // AuthContext에서 로그인 상태 가져오기
import './Guide.css'; // 새로운 Guide.css 파일을 사용

function Guide() {
  const { isAuthenticated } = useAuth(); // 로그인 상태 가져오기

  return (
    <div className="main-container">
      <div className="guide-container">
        <div className="guide-header">
          <h1>KKHC</h1>
        </div>

        <div className="guide-cards">
          {/* 회원가입 전 가이드 */}
          <div className="guide-card">
            <h2>회원가입 전 안내</h2>

            <p>
              저희 프로그램은 주통스크립트로 돌아가며,<br></br> 다음과 같은
              기능을 제공합니다:
            </p>
            <br></br>
            <ul>
              <p>
                <strong>프로그램</strong>: <br></br>프로그램 페이지에서 아이디를
                입력하고 버튼을 클릭해야만<br></br> 게시판 및 CPU 메모리등 진단
                결과를 확인할 수 있습니다.
              </p>
              <br></br>
              <p>
                <strong>로그인 & 회원가입</strong>: <br></br>사용자 인증을 위한
                페이지입니다.<br></br> 처음 오신 분은 가입 또는 로그인 후
                이용하실 수 있습니다.
              </p>
              <br></br>
            </ul>
            {!isAuthenticated && (
              <p className="guide-login-prompt">
                시작하기 전에, 먼저 <a href="/register">회원가입</a> 또는{' '}
                <a href="/login">로그인</a>을 해주세요.<br></br> 이후 원하시는
                서비스를 자유롭게 이용하실 수 있습니다.
                <br></br>
              </p>
            )}
          </div>

          {/* 회원가입 후 가이드 */}
          <div className="guide-card">
            <h2>회원가입 후 안내</h2>
            <ul>
              <p>
                <strong>게시판</strong>: <br></br>로그인한 사용자가 관리자 ID,
                비밀번호, 서버 IP 등을 입력한 <br></br>게시물을 생성하여 회사의
                서버를 진단할 수 있습니다. <br /> 진행 상태가 진단완료로
                표시되면 회사 메일로 알림이 갑니다. <br></br> <br></br>
              </p>
              <p>
                <strong>CPU & Memory Reports</strong>: <br></br>서버의 모니터링
                결과를 그래프로 보여줍니다. <br></br> <br></br>
              </p>
              <p>
                <strong>로그아웃 및 새로고침</strong>: <br></br>로그아웃 버튼을
                누르거나 새로고침을 하면
                <br /> 자동으로 로그아웃 됩니다.
                <br />
                <br /> 설정해놓은 데이터 베이스가 초기화되니
                <br /> 프로그램 페이지에 가서 다시 아이디를 입력하고
                <br /> 버튼을 눌러주세요.
                <br />
              </p>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
