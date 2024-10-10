import React, { useRef, useEffect, useState } from 'react';
import './Home.css';
import Header from './Header';
import Footer from './Footer';
import HowAbout from './HowAbout'; // HowAbout 컴포넌트 임포트
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const infoSectionRef = useRef(null);
  const guideSectionRef = useRef(null);
  const howAboutSectionRef = useRef(null); // howAboutSectionRef 추가
  const homeSectionRef = useRef(null);

  const [modalImage, setModalImage] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleLearnMoreClick = () => {
    navigate('/SiteGuide'); // Redirect to the SiteGuide page
  };

  const handleCheckVulnerabilityClick = () => {
    navigate('/guide'); // Redirect to the vulnerability check page (경로는 필요에 맞게 변경하세요)
  };

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (guideSectionRef.current) {
      observer.observe(guideSectionRef.current);
    }

    return () => {
      if (guideSectionRef.current) {
        observer.unobserve(guideSectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div className="homeBody">
      <Header
        infoSectionRef={infoSectionRef}
        guideSectionRef={guideSectionRef}
        homeSectionRef={homeSectionRef}
      />

      <section ref={infoSectionRef} className="info-section-content">
        <h2 className="slogan-content">K K H C</h2>
        <h2 className="slogan-content2">취약점 진단</h2>
        <p className="sub-slogan-content">Check Your Vulnerability</p>
        <button
          className="check-vulnerability-btn styled-button"
          onClick={handleCheckVulnerabilityClick}
        >
          바로가기
        </button>
      </section>

      <section
        ref={guideSectionRef}
        className={`guide-section ${isInView ? 'animate' : ''}`}
      >
        <h2>사이트 사용 가이드</h2>
        <p>주요 페이지들과 사용 방법에 대해 알아보세요</p>

        <div className="guide-grid">
          <Swiper
            className="home-swiper"
            spaceBetween={20} // Controls spacing between slides
            slidesPerView={4.5}
            centeredSlides={false}
            loop={false}
            watchOverflow={true}
            pagination={{ clickable: true }}
            onProgress={(swiper, progress) => {
              setProgress(progress * 100); // Dynamically update progress
            }}
            slidesOffsetBefore={70} // Adds space before the first slide
            slidesOffsetAfter={70} // Adds space after the last slide
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                slidesOffsetBefore: 15,
                slidesOffsetAfter: 15,
              },
              768: {
                slidesPerView: 2.5,
                slidesOffsetBefore: 30,
                slidesOffsetAfter: 30,
              },
              1024: {
                slidesPerView: 3.5,
                slidesOffsetBefore: 40,
                slidesOffsetAfter: 40,
              },
              1200: {
                slidesPerView: 4.5,
                slidesOffsetBefore: 70, // Adjust this value as needed for larger screens
                slidesOffsetAfter: 70, // Adjust this value as needed for larger screens
              },
            }}
          >
            <SwiperSlide>
              <div className="guide-card">
                <img src="/images/1image.png" alt="Step 1" />
                <div className="guide-caption">
                  <p>1. 회원가입</p>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="guide-card">
                <img src="/images/2image.png" alt="Step 2" />
                <div className="guide-caption">
                  <p>2. 로그인, 로그아웃</p>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="guide-card">
                <img src="/images/3image.png" alt="Step 3" />
                <div className="guide-caption">
                  <p>3. 로그인 후 게시판 페이지에 글쓰기</p>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div
                className="guide-card"
                // onClick={() => openModal('/images/4image.png')}
              >
                <img src="/images/4image.png" alt="Step 4" />
                <div className="guide-caption">
                  <p>4. 결과물 기다리기</p>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div
                className="guide-card"
                // onClick={() => openModal('/images/6image.png')}
              >
                <img src="/images/5image.png" alt="Step 5" />
                <div className="guide-caption">
                  <p>5. DB설정하기</p>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div
                className="guide-card"
                // onClick={() => openModal('/images/7image.png')}
              >
                <img src="/images/6image.png" alt="Step 6" />
                <div className="guide-caption">
                  <p>6. 취약점 확인하기</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        {/* Wrapper for the navigation and progress bar */}
        <div className="swiper-navigation-progress">
          <div className="swiper-progress-bar">
            <div
              className="swiper-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="guide-learn-more">
          <button className="learn-more-btn" onClick={handleLearnMoreClick}>
            더 알아보기
          </button>
        </div>

        {modalImage && (
          <div className="home-modal" onClick={closeModal}>
            <span className="home-close-modal">&times;</span>
            <div className="home-modal-content">
              <img src={modalImage} alt="Expanded View" />
            </div>
          </div>
        )}
      </section>

      {/* HowAbout Section 추가 */}
      <div ref={howAboutSectionRef}>
        <HowAbout />
      </div>

      <div ref={homeSectionRef} className="home-grid">
        <div className="home-sub-grid home-sub-grid-1">
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
                    <a
                      href="https://www.joongbu.ac.kr/ipsi/intro_2024/intro0926/index.html"
                      target="_blank"
                      rel="noreferrer"
                    >
                      정보보호학과 졸업작품
                    </a>
                  </span>
                </div>
              </figcaption>
            </figure>
          </article>

          <article className="home-card">
            <figure>
              <img
                width="1600"
                height="1067"
                src="/images/key-point-vulnerability-assessment-checklist.png"
                alt=""
              />
              <figcaption>
                <div>
                  가이드
                  <span>
                    <a href="/SiteGuide" target="_blank" rel="noreferrer">
                      바로가기
                    </a>
                  </span>
                </div>
              </figcaption>
            </figure>
          </article>

          <article className="home-card">
            <figure>
              <img
                width="1600"
                height="1036"
                src="/images/25fsh222fsdgxh.png"
                alt=""
              />
              <figcaption>
                <div>
                  강김홍차
                  <span>
                    <a href="/team" target="_blank" rel="noreferrer">
                      2024 정보보호학과 졸업팀
                    </a>
                  </span>
                </div>
              </figcaption>
            </figure>
          </article>
        </div>
        <article className="home-card program-card">
          <figure>
            <img
              width="1600"
              height="900"
              src="/images/2024-09-26 233813.png"
              alt="M"
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

      <div className="logos">
        <div className="logos-slide">
          <img src="/images/logo1.png" alt="Barstool" />
          <img src="/images/logo2.png" alt="Barstool" />
          <img src="/images/logo3.png" alt="Barstool" />
          <img src="/images/logo4.png" alt="Barstool" />
          <img src="/images/logo5.png" alt="Barstool" />
          <img src="/images/logo6.png" alt="Barstool" />
        </div>
        {/* 두 번째 슬라이드를 추가하여 무한 반복 */}
        <div className="logos-slide">
          <img src="/images/logo1.png" alt="Barstool" />
          <img src="/images/logo2.png" alt="Barstool" />
          <img src="/images/logo3.png" alt="Barstool" />
          <img src="/images/logo4.png" alt="Barstool" />
          <img src="/images/logo5.png" alt="Barstool" />
          <img src="/images/logo6.png" alt="Barstool" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
