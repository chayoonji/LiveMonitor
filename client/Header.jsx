import React from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Header.css 파일을 임포트합니다.

function Header({ infoSectionRef, guideSectionRef, homeSectionRef }) {
  const navigate = useNavigate();

  // "Home" 버튼을 클릭하면 /home 경로로 이동하는 함수
  const handleHomeClick = () => {
    navigate('/home'); // This navigates to the Home page
  };

  // "Guide" 버튼을 클릭하면 /SiteGuide 경로로 이동하는 함수
  const handleGuideClick = () => {
    navigate('/SiteGuide'); // This navigates to the SiteGuide page
  };

  const handleKKHCClick = () => {
    navigate('/Information'); // This navigates to the SiteGuide page
  };

  const handleLoginClick = () => {
    navigate('/guide'); // Navigates to the login page when the icon is clicked
  };

  const handleTeamClick = () => {
    navigate('/Team'); // Navigates to the login page when the icon is clicked
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/images/unnamed.png" alt="Logo" className="header-logo" />{' '}
        {/* 로고 이미지를 추가 */}
        <span className="logo do-hyeon-regular">KKHC</span> {/* 로고 텍스트 */}
      </div>
      <div className="header-center">
        {/* Home 버튼을 클릭하면 /home 페이지로 이동 */}
        <button
          className="home-button do-hyeon-regular"
          onClick={handleHomeClick}
        >
          Home
        </button>
        <button
          className="guide-button do-hyeon-regular"
          onClick={handleKKHCClick}
        >
          Information
        </button>
        {/* Guide 버튼을 클릭하면 /SiteGuide로 이동 */}
        <button
          className="guide-button do-hyeon-regular"
          onClick={handleGuideClick}
        >
          Guide
        </button>
        <button
          className="guide-button do-hyeon-regular"
          onClick={handleTeamClick}
        >
          Team
        </button>
      </div>
      <div className="header-right">
        <BsPersonCircle className="icon" onClick={handleLoginClick} />
      </div>
    </header>
  );
}

export default Header;
