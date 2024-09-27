import React, { useRef, useEffect, useState } from 'react';
import './Home.css'; // Home.css 파일을 불러옵니다
import Header from './Header'; // Header 컴포넌트를 불러옵니다
import Footer from './Footer'; // Footer 컴포넌트를 불러옵니다

const Home = () => {
  const infoSectionRef = useRef(null); // infoSectionRef를 Home에서 관리
  const guideSectionRef = useRef(null); // guideSectionRef 추가
  const homeSectionRef = useRef(null); // homeSectionRef 추가 (카드 섹션을 가리킴)

  const [modalImage, setModalImage] = useState(null);

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  useEffect(() => {
    // Home.jsx가 렌더링될 때 body 배경색을 흰색으로 설정
    document.body.style.backgroundColor = 'white';

    // 컴포넌트가 사라질 때 원래 스타일로 되돌림
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="homeBody">
      {/* Header에 infoSectionRef, guideSectionRef, homeSectionRef를 전달 */}
      <Header
        infoSectionRef={infoSectionRef}
        guideSectionRef={guideSectionRef}
        homeSectionRef={homeSectionRef}
      />

      {/* 정보 섹션 */}
      <section ref={infoSectionRef} className="info-section">
        <h2 className="slogan">프로젝트 이름</h2>
        <div className="info-content">
          <p>
            서버 보안 취약점 분석 사이트로서,<br></br>정보 보호를 위한 다양한
            도구와 리소스를 제공합니다.
          </p>
          <p>주요 기능들은 다음에 해당됩니다 :</p>
          <ul>
            <li>서버 보안 취약점 스캔</li>
            <li>취약점 보고서 생성</li>
            <li>보안 권장 사항 제공</li>
          </ul>
          <br></br>
          {/* 이동하기 버튼 추가 */}
          <button
            className="move-button"
            onClick={() => (window.location.href = '/')}
          >
            이동하기
          </button>
        </div>
      </section>
      {/* Guide Section */}
      <section ref={guideSectionRef} className="guide-section">
        <h2>사이트 이용하기</h2>

        {/* Grid container for guide cards */}
        <div className="guide-grid">
          {/* First card */}
          <div
            className="guide-card"
            onClick={() => openModal('/images/1image.png')}
          >
            <img src="/images/1image.png" alt="Step 1" />
            <div className="guide-caption">1. 회원가입</div>
          </div>

          {/* Second card */}
          <div
            className="guide-card"
            onClick={() => openModal('/images/1.1image.png')}
          >
            <img src="/images/1.1image.png" alt="Step 2" />
            <div className="guide-caption">2. 로그인, 로그아웃 </div>
          </div>

          {/* Third card */}
          <div
            className="guide-card"
            onClick={() => openModal('/images/2image.png')}
          >
            <img src="/images/2image.png" alt="Step 3" />
            <div className="guide-caption">
              3.로그인 후 게시판 페이지에 글쓰기
            </div>
          </div>

          {/* 4th card */}
          <div
            className="guide-card"
            onClick={() => openModal('/images/4image.png')}
          >
            <img src="/images/4image.png" alt="Step 3" />
            <div className="guide-caption">4.결과물 기다리기</div>
          </div>

          {/* 5th card */}
          <div
            className="guide-card"
            onClick={() => openModal('/images/6image.png')}
          >
            <img src="/images/6image.png" alt="Step 3" />
            <div className="guide-caption">5.DB설정하기</div>
          </div>

          {/* 6th card */}
          <div
            className="guide-card"
            onClick={() => openModal('/images/7image.png')}
          >
            <img src="/images/7image.png" alt="Step 3" />
            <div className="guide-caption">6.취약점 확인하기</div>
          </div>
        </div>
      </section>

      {modalImage && (
        <div className="home-modal" onClick={closeModal}>
          <span className="home-close-modal">&times;</span>
          <div className="home-modal-content">
            <img src={modalImage} alt="Expanded View" />
          </div>
        </div>
      )}

      {/* 카드 그리드 섹션 */}
      <div ref={homeSectionRef} className="home-grid">
        <div className="home-sub-grid home-sub-grid-1">
          {/* 첫 번째 이미지 카드 */}
          <article className="home-card">
            <figure>
              <img
                width="1600"
                height="900"
                src="/images/l_2013010501004243100087921.jpg"
                alt="중부대학교"
              />
              <figcaption>
                <div>
                  중부대학교
                  <span>
                    <a href="/" target="_blank" rel="noreferrer">
                      정보보호학과 졸업작품
                    </a>
                  </span>
                </div>
              </figcaption>
            </figure>
          </article>

          {/* 두 번째 이미지 카드 */}
          <article className="home-card">
            <figure>
              <img
                width="1600"
                height="1067"
                src="/images/2024-09-26 233813.png"
                alt="Kvalvika Beach, Moskenes, Norway"
              />
              <figcaption>
                <div>
                  취약점
                  <span>
                    <a href="/" target="_blank" rel="noreferrer"></a>
                  </span>
                </div>
              </figcaption>
            </figure>
          </article>

          {/* 세 번째 이미지 카드 */}
          <article className="home-card">
            <figure>
              <img
                width="1600"
                height="1036"
                src="/images/25fsh222fsdgxh.png"
                alt="San Lorenzo, Italy"
              />
              <figcaption>
                <div>
                  강김홍차
                  <span>
                    <a href="/" target="_blank" rel="noreferrer">
                      2024 정보보호학과 졸업팀
                    </a>
                  </span>
                </div>
              </figcaption>
            </figure>
          </article>
        </div>

        {/* 네 번째 이미지 카드 */}
        <article className="home-card">
          <figure>
            <img
              width="1600"
              height="900"
              src="/images/key-point-vulnerability-assessment-checklist.png"
              alt="McWay Falls, California, USA"
            />
            <figcaption>
              <div>
                프로그램 사이트
                <span>
                  <a href="/" target="_blank" rel="noreferrer">
                    바로가기
                  </a>
                </span>
              </div>
            </figcaption>
          </figure>
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
