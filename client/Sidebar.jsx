import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsFillDoorOpenFill,
} from "react-icons/bs";

function Sidebar({ openSidebarToggle, isAuthenticated, handleLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    handleLogout();
    navigate("/login");
  };

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <Link to="/" style={{ textDecoration: "none", color: "#9e9ea4" }}>
            <BsCart3 className="icon_header" /> 강김홍차
          </Link>
        </div>
      </div>

      <ul className="sidebar-list">
        {!isAuthenticated ? (
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
        ) : (
          <>
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
            <li className="sidebar-list-item">
              <Link to="/members">
                <BsPeopleFill className="icon" /> 회원 관리
              </Link>
            </li>
            <li className="sidebar-list-item">
              <a href="https://github.com/chayoonji/reactDashB">
                <BsListCheck className="icon" /> Github
              </a>
            </li>
            <li className="sidebar-list-item">
              <Link to="/logout" onClick={handleLogoutClick}>
                <BsFillDoorOpenFill className="icon" /> Logout
              </Link>
            </li>
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
          </>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
