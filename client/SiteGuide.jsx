import React, { useState } from 'react';
import Header from './Header';
import './SiteGuide.css';
import Footer from './Footer';

function SiteGuide() {
  const [activeSection, setActiveSection] = useState('로그인 전');

  const renderSectionContent = () => {
    switch (activeSection) {
      case '로그인 전':
        return (
          <div className="site-guide-section">
            <h2 className="site-guide-section-title">로그인 전 이용 가이드</h2>
            <div className="site-guide-box-wrapper">
              <div className="site-guide-box">
                <div className="site-guide-grid">
                  <div>
                    <img
                      className="site-guide-image"
                      src="/images/Guide1.png"
                      alt="회원가입"
                    />
                    <div className="site-guide-text">
                      <h3>회원가입</h3>
                      <p>데이터가 저장되는 DB명을 아이디로 설정해주세요.</p>
                    </div>
                  </div>
                  <div>
                    <img
                      className="site-guide-image"
                      src="/images/Guide2.png"
                      alt="로그인"
                    />
                    <div className="site-guide-text">
                      <h3>로그인</h3>
                      <p>
                        로그인시 사이드바의 이용 가능한 페이지들이 활성화됩니다.
                      </p>
                    </div>
                  </div>
                  <div>
                    <img
                      className="site-guide-image"
                      src="/images/Guide3.png"
                      alt="글쓰기"
                    />
                    <div className="site-guide-text">
                      <h3>3. 글쓰기</h3>
                      <p>글쓰기를 통해 진단을 요청해주세요.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case '게시글 작성':
        return (
          <div className="site-guide-section">
            <h2 className="instruction-title">게시글 작성 양식</h2>
            <div className="instruction-section">
              <div className="instruction-content">
                {/* Boxed content with black border */}
                <div className="boxed-content">
                  <p>서버 IP:</p>
                  <p>관리자 IP:</p>
                  <p>관리자 PW:</p>
                  <p>루트 비밀번호:</p>
                </div>
                <br />
                <p>비밀번호는 잊지 않도록 주의해주세요.</p>
                <br></br>
                <p>본문 글 작성이 시작되면 양식이 보이지 않습니다.</p>
                <p>
                  본문에 작성해야 할 내용은 다른 곳에서 작성한 뒤 옮겨주세요.
                </p>
                <br></br>
                <p>본인이 작성한 게시물은 비밀번호 입력 과정이 생략됩니다.</p>
                <p>
                  타인의 게시물인 경우에만 비밀번호 인증 시스템이 출력됩니다.
                </p>
              </div>
              <div className="instruction-image">
                <img src="/images/Guide4.png" alt="설명 이미지" />
              </div>
            </div>
          </div>
        );
      case '로그인 후':
        return (
          <div className="site-guide-section">
            <h2 className="site-guide-section-title">
              DB 설정, 진단 과정, 결과 보기
            </h2>
            <div className="site-guide-box-wrapper">
              <div className="site-guide-box">
                <div className="site-guide-grid-emphasized">
                  <div className="left-right-layout">
                    <img
                      className="site-guide-image-emphasized-small"
                      src="/images/Guide5.png"
                      alt="DB 연결하기"
                    />
                    <div className="site-guide-text-emphasized">
                      <h3>[ 프로그램 ] 가이드</h3>
                      <br></br>
                      <p>
                        회원가입 때 입력한 ID를 입력하여<br></br> DB에 입력된
                        진단결과를 페이지로 불러옵니다.
                      </p>
                      <br></br>
                      <p>
                        취약점을 분석하는 동안 진단된 Cpu, Memory에 대한 결과를
                        <br></br>
                        그래프로 확인할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="right-left-layout">
                    <img
                      className="site-guide-image-emphasized-small"
                      src="/images/Guide6-2.png"
                      alt="진단 과정"
                    />
                    <div className="site-guide-text-emphasized">
                      <h3>[ 게시판 ] 가이드 </h3>
                      <br></br>
                      <p>
                        게시물을 열람할 때는 비밀번호를 입력해야합니다.
                        <br></br>
                        <br></br>본인이 생성한 게시물에만 게시글 작성자 확인이
                        가능합니다.
                      </p>
                    </div>
                  </div>

                  <div className="left-right-layout">
                    <img
                      className="site-guide-image-emphasized-small"
                      src="/images/Guide6-1.png"
                      alt="진단 과정"
                    />
                    <div className="site-guide-text-emphasized">
                      <h3>[ 게시물 ] 가이드</h3>
                      <p>
                        진단이 완료되면 이메일 주소로 메일이 전송되며,<br></br>{' '}
                        게시물 내의 [ 진단 결과 보기 ] 버튼이 활성화됩니다.
                        <br></br>
                        <br></br>본인이 작성한 게시물의 작성자로 로그인 한
                        상태라면 <br></br>
                        비밀번호 없이 새 창으로 파일 다운 및 진단 결과를
                        <br></br> 확인할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="right-left-layout">
                    <img
                      className="site-guide-image-emphasized-small"
                      src="/images/Guide7.png"
                      alt="결과 보기"
                    />
                    <div className="site-guide-text-emphasized">
                      <h3>취약점 진단 결과 확인 </h3>
                      <p>
                        [ 진단 결과 보기 ] 버튼을 통해 해당 페이지로 이동하면
                        <br></br> 진단한 항목을 ID, 분류, 결과, 결과상세로
                        나누어<br></br> 확인할 수 있습니다.<br></br>
                        <br></br>결과가 취약인 값은 클릭 시 조치사항 안내
                        페이지로 이동됩니다.
                        <br></br>
                        <br></br>검색 창에는 ID, 분류, 결과값을 입력해주세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="site-guide-container">
      <Header /> {/* Include Header */}
      <div className="information-hero">
        <img
          src="/images/Header.png"
          alt="Hero Background"
          className="information-hero-img"
        />
        <h1
          className="information-title"
          style={{
            position: 'absolute',
            top: '64%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
          }}
        >
          KKHC 이용 가이드
        </h1>
      </div>
      <div className="button-group">
        <button
          onClick={() => setActiveSection('로그인 전')}
          className={activeSection === '로그인 전' ? 'active' : ''}
        >
          로그인 전
        </button>
        <button
          onClick={() => setActiveSection('게시글 작성')}
          className={activeSection === '게시글 작성' ? 'active' : ''}
        >
          게시글 작성
        </button>
        <button
          onClick={() => setActiveSection('로그인 후')}
          className={activeSection === '로그인 후' ? 'active' : ''}
        >
          로그인 후
        </button>
      </div>
      <div className="site-guide-content">{renderSectionContent()}</div>
      <Footer />
    </div>
  );
}

export default SiteGuide;
