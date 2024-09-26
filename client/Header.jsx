import React from 'react';
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Header.css 파일을 임포트합니다.

function Header({ infoSectionRef, guideSectionRef, homeSectionRef }) {
  const navigate = useNavigate();

  // "Information" 버튼 클릭 시 스크롤을 아래로 이동시키는 함수
  const scrollToInfoSection = () => {
    if (infoSectionRef && infoSectionRef.current) {
      infoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleLoginClick = () => {
    navigate('/login'); // Navigates to the login page when the icon is clicked
  };

  // "Guide" 버튼 클릭 시 가이드 섹션으로 스크롤하는 함수
  const scrollToGuideSection = () => {
    if (guideSectionRef && guideSectionRef.current) {
      guideSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // "Home" 버튼 클릭 시 페이지 상단으로 스크롤하는 함수
  const scrollToHomeSection = () => {
    if (homeSectionRef && homeSectionRef.current) {
      homeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src="/images/unnamed.png" alt="Logo" className="header-logo" />{' '}
          {/* 로고 이미지를 추가 */}
          <span className="logo">KKHC</span> {/* 로고 텍스트 */}
        </div>
        <div className="header-center">
          <button className="home-button" onClick={scrollToInfoSection}>
            Home
          </button>
          <button className="guide-button" onClick={scrollToGuideSection}>
            Guide
          </button>
          <button className="info-button" onClick={scrollToHomeSection}>
            Information
          </button>

          {/* <button className="works-button">My Works</button>
          <button className="community-button">Community</button> */}
        </div>
        <div className="header-right">
          <BsPersonCircle className="icon" onClick={handleLoginClick} />
        </div>
      </header>
    </>
  );
}

export default Header;
