import React from 'react';
import './Footer.css'; // Footer의 스타일 파일을 임포트합니다.

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 KKHC. All Rights Reserved.</p>
        <ul className="footer-links">
          <li>
            <a href="/Home">Home</a>
          </li>
          <li>
            <a href="/terms">Information</a>
          </li>
          <li>
            <a href="/contact">Contact Us</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
