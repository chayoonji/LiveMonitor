import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();

  const handleReportsClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
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
        <li className="sidebar-list-item">
          <Link to="/guide">
            <BsGrid1X2Fill className="icon" /> 가이드
          </Link>
        </li>

        {/* 프로그램은 진단 버튼 누르면 쉘스크립트 동작하는 페이지 */}

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
          <Link to="/login" onClick={handleReportsClick}>
            <BsFillGearFill className="icon" /> Login
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/register" onClick={handleRegisterClick}>
            <BsFillGearFill className="icon" /> 회원가입
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
      </ul>
    </aside>
  );
}

export default Sidebar;
