import React from 'react';
import Header from './Header';
import './SiteGuide.css';
import Footer from './Footer';

function SiteGuide() {
  return (
    <div className="site-guide-container">
      <Header /> {/* Include Header */}
      <div className="site-guide-content">
        {/* Section 1 */}
        <h2 className="site-guide-section-title">회원가입, 로그인, 글쓰기</h2>
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
                  <h3>글쓰기</h3>
                  <p>글쓰기를 통해 진단을 요청해주세요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Section: Form Instructions with large image */}
        <div className="instruction-section">
          <div className="instruction-content">
            <h2 className="instruction-title">게시글 작성 양식</h2>

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
            <p>본문에 작성해야 할 내용은 다른 곳에서 작성한 뒤 옮겨주세요.</p>
            <br></br>
            <p>본인이 작성한 게시물은 비밀번호 입력 과정이 생략됩니다.</p>
            <p>타인의 게시물인 경우에만 비밀번호 인증 시스템이 출력됩니다.</p>
          </div>

          <div className="instruction-image">
            <img src="/images/Guide4.png" alt="설명 이미지" />
          </div>
        </div>

        {/* Section 2 */}
        <h2 className="site-guide-section-title section-spacing">
          DB 설정, 진단 과정, 결과 보기
        </h2>
        <div className="site-guide-box-wrapper">
          <div className="site-guide-box">
            <div className="site-guide-grid">
              <div>
                <img
                  className="site-guide-image"
                  src="/images/Guide5.png"
                  alt="작성 내용 안내"
                />
                <div className="site-guide-text">
                  <h3>DB연결하기</h3>
                  <p>
                    취약점을 분석하는 동안 진단된<br></br> Cpu, Memory에 대한
                    결과를
                    <br></br>
                    그래프로 확인할 수 있습니다.
                  </p>
                </div>
              </div>
              <div>
                <img
                  className="site-guide-image"
                  src="/images/Guide6.png"
                  alt="DB 설정"
                />
                <div className="site-guide-text">
                  <h3>진단 과정</h3>
                  <p>
                    결과물이 업로드되면 회원가입 때 작성한<br></br>이메일 주소로
                    메일이 전송됩니다.<br></br>작성한 게시물에서 진단결과보기
                    버튼을 클릭해주세요
                  </p>
                </div>
              </div>
              <div>
                <img
                  className="site-guide-image"
                  src="/images/Guide7.png"
                  alt="결과 보기"
                />
                <div className="site-guide-text">
                  <h3>결과 보기</h3>
                  <p>
                    취약점 분석 결과를 표와 그래프로 출력합니다.<br></br> 결과가
                    취약인 값은 클릭 시 조치사항 안내 페이지로 이동됩니다.{' '}
                    <br></br>id, 분류, 결과값으로 검색기능을 이용할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SiteGuide;
