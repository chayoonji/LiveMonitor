import React from 'react';
import './App.css';

function Guide() {
  return (
    <div className="main-container">
      <div className="guide-header">
        <h1>환영합니다!</h1>
      </div>
      <div className="guide-content">
        <p>저희 프로그램은 주통스크립트로 돌아가며, 다음과 같은 기능을 제공합니다:</p>
        <ul>
          <li><strong>팀원 소개</strong>: 프로젝트에 참여한 팀원들을 소개합니다.</li>
          <li><strong>회원 관리</strong>: 로그인한 사용자가 관리자 ID, 비밀번호, 서버 IP 등을 입력하여 실시간으로 회사의 서버를 진단할 수 있습니다.</li>
          <li><strong>로그인 & 회원가입</strong>: 사용자 인증을 위한 페이지입니다. 처음 오신 분은 가입 또는 로그인 후 이용하실 수 있습니다.</li>
          <li><strong>CPU & Memory Reports</strong>: 서버의 실시간 모니터링 결과를 그래프로 보여줍니다.</li>
        </ul>
        <p>시작하기 전에, 먼저 <a href="/register">회원가입</a> 또는 <a href="/login">로그인</a>을 해주세요. 이후 원하시는 서비스를 자유롭게 이용하실 수 있습니다.</p>
      </div>
    </div>
  );
}

export default Guide;
