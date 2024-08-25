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
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsBoxArrowRight,
} from 'react-icons/bs';

function Sidebar({ openSidebarToggle }) {
  const navigate = useNavigate();
  const authContext = useAuth();
  const isAuthenticated = authContext && authContext.isAuthenticated;
  const logout = authContext && authContext.logout;

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? 'sidebar-responsive' : ''}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: '#9e9ea4' }}>
            <BsCart3 className="icon_header" /> 강김홍차
          </Link>
        </div>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/guide">
            <BsGrid1X2Fill className="icon" /> 가이드
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/routine">
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
              <Link to="/login">
                <BsFillGearFill className="icon" /> Login
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/register">
                <BsFillGearFill className="icon" /> 회원가입
              </Link>
            </li>
          </>
        )}
        {isAuthenticated && (
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
              <Link to="/board">
                <BsPeopleFill className="icon" /> 게시판
              </Link>
            </li>
            <li className="sidebar-list-item">
              <button
                onClick={handleLogoutClick}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  margin: 0,
                  color: '#9e9ea4',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <BsBoxArrowRight className="icon" /> Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
