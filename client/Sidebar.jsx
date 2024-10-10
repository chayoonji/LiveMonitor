import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsBoxArrowRight,
  BsHouseFill, // Add this icon for 'Main Home'
} from 'react-icons/bs';
import './Sidebar.css'; // Add this to import the new CSS

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const authContext = useAuth();
  const isAuthenticated =
    authContext && authContext.isAuthenticated
      ? authContext.isAuthenticated
      : false;
  const logout =
    authContext && authContext.logout ? authContext.logout : () => {};

  const handleReportsClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    navigate('/register'); // 페이지 이동
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const handleMainHomeClick = () => {
    navigate('/Home');
  };

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? 'sidebar-responsive' : ''}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <Link to="/guide" style={{ textDecoration: 'none', color: '#9e9ea4' }}>
            {' '}
            강김홍차
          </Link>
        </div>
      </div>

      <ul className="sidebar-list">
        {/* <li className="sidebar-list-item">
          <Link to="/guide">
            <BsGrid1X2Fill className="icon" /> 가이드
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/team">
            <BsFillGrid3X3GapFill className="icon" /> 팀원 소개
          </Link>
        </li> */}

        {!isAuthenticated && (
          <>
            <li className="sidebar-list-item" onClick={handleReportsClick}>
              <div className="sidebar-link">
                <BsFillGearFill className="icon" /> 로그인
              </div>
            </li>
            <li className="sidebar-list-item" onClick={handleRegisterClick}>
              <div className="sidebar-link">
                <BsFillGearFill className="icon" /> 회원가입
              </div>
            </li>
          </>
        )}

        {isAuthenticated && (
          <>
            <li
              className="sidebar-list-item"
              onClick={() => navigate('/routine')}
            >
              <div className="sidebar-link">
                <BsFillArchiveFill className="icon" /> 프로그램
              </div>
            </li>

            <li
              className="sidebar-list-item"
              onClick={() => navigate('/reports1')}
            >
              <div className="sidebar-link">
                <BsMenuButtonWideFill className="icon" /> CPU Reports
              </div>
            </li>

            <li
              className="sidebar-list-item"
              onClick={() => navigate('/reports2')}
            >
              <div className="sidebar-link">
                <BsMenuButtonWideFill className="icon" /> Memory Reports
              </div>
            </li>
            <li
              className="sidebar-list-item"
              onClick={() => navigate('/Board')}
            >
              <div className="sidebar-link">
                <BsPeopleFill className="icon" /> 게시판
              </div>
            </li>
            <li className="sidebar-list-item" onClick={handleLogoutClick}>
              <button className="icon">
                <BsBoxArrowRight className="icon" /> 로그아웃
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Main Home button */}
      <div className="sidebar-bottom">
        <button onClick={handleMainHomeClick} className="main-home-btn">
          <BsHouseFill className="icon" /> 메인홈
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
