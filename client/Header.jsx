// client/Header.jsx
import React from 'react';
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Header.css 파일을 임포트합니다.

function Header({ OpenSidebar }) {
  const navigate = useNavigate();

  const handleGuidePage = () => {
    navigate('/guide');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-icon" onClick={OpenSidebar}>
          <BsJustify className="icon" />
        </button>
        <span className="logo">KKHC</span> {/* 중앙의 로고 */}
      </div>
      <div className="header-center">
        <button className="guide-button" onClick={handleGuidePage}>
          Guide
        </button>
        <button className="works-button">My Works</button>
        <button className="community-button">Community</button>
      </div>
      <div className="header-right">
        <BsSearch className="icon" />
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <BsPersonCircle className="icon" />
      </div>
    </header>
  );
}

export default Header;
