// client/Sidebar.jsx
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
} from 'react-icons/bs';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleReportsClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const handleReportsClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <aside
      id="sidebar"
      className={
        openSidebarToggle ? 'sidebar sidebar-open' : 'sidebar sidebar-close'
      }
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: '#9e9ea4' }}>
            <BsCart3 className="icon_header" /> 강김홍차
          </Link>
        </div>
      </div>

      <ul className="sidebar-list">
<<<<<<< HEAD
        {isAuthenticated ? (
=======
        <li className="sidebar-list-item">
          <Link to="/guide">
            <BsGrid1X2Fill className="icon" /> 가이드
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/program">
            <BsFillArchiveFill className="icon" /> 프로그램
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/team">
            <BsFillGrid3X3GapFill className="icon" /> 팀원 소개
          </Link>
        </li>

        {!isAuthenticated && (
          <>
            <li className="sidebar-list-item">
              <Link to="/login" onClick={handleReportsClick}>
                <BsFillGearFill className="icon" /> Login
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/register" onClick={handleRegisterClick}>
                <BsFillGearFill className="icon" /> 회원가입
              </Link>
            </li>
          </>
        )}

        {isAuthenticated && (
>>>>>>> main
          <>
            <li className="sidebar-list-item">
              <Link to="/reports1">
                <BsMenuButtonWideFill className="icon" /> CPU Reports
              </Link>
            </li>

            <li className="sidebar-list-item">
              <Link to="/reports2">
                <BsMenuButtonWideFill className="icon" /> Memory Reports
              </Link>
            </li>
            <li className="sidebar-list-item">
<<<<<<< HEAD
              <Link to="/program">
                <BsFillArchiveFill className="icon" /> 프로그램
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/members">
                <BsPeopleFill className="icon" /> 회원 관리
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/reports">
                <BsMenuButtonWideFill className="icon" /> Reports
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/login" onClick={handleLogoutClick}>
                <BsFillDoorOpenFill className="icon" /> Logout
              </Link>
=======
              <button
                onClick={handleLogoutClick}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                <BsBoxArrowRight className="icon" /> Logout
              </button>
>>>>>>> main
            </li>
          </>
        ) : (
          <>
            <li className="sidebar-list-item">
              <Link to="/login" onClick={handleReportsClick}>
                <BsFillGearFill className="icon" /> Login
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/register" onClick={handleRegisterClick}>
                <BsFillGearFill className="icon" /> 회원가입
              </Link>
            </li>
          </>
        )}
        <li className="sidebar-list-item">
          <Link to="/team">
            <BsFillGrid3X3GapFill className="icon" /> 팀원 소개
          </Link>
        </li>
        <li className="sidebar-list-item">
          <a href="https://github.com/chayoonji/reactDashB">
            <BsListCheck className="icon" /> Github
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
