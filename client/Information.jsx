import React, { useState } from 'react';
import './Information.css';
import Header from './Header'; // Assuming the Header component is already built
import Footer from './Footer'; // Assuming Footer component exists

const Information = () => {
  const [activeContent, setActiveContent] = useState('제공하는 기능');

  const renderContent = () => {
    switch (activeContent) {
      case '제공하는 기능':
        return (
          <>
            <img
              src="/images/FeaturesProvided.png"
              alt="프로그램 구조도"
              className="structure-diagram"
            />
          </>
        );
      case '사용 기술':
        return (
          <>
            <img
              src="/images/Using.png"
              alt="프로그램 구조도"
              className="structure-diagram"
            />
          </>
        );
      case '프로그램 구조도':
        return (
          <>
            <h3>프로그램 구조도</h3>
            <img
              src="/images/Using.png"
              alt="프로그램 구조도"
              className="structure-diagram"
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderSubTitle = () => {
    switch (activeContent) {
      case '제공하는 기능':
        return '저희가 제공하는 기능들을 확인해보세요.';
      case '사용 기술':
        return '서버 모니터링을 위해 사용된 기술들을 알아보세요.';
      case '프로그램 구조도':
        return '프로그램 구조도를 통해 전체 흐름을 확인해보세요.';
      default:
        return '';
    }
  };

  return (
    <div className="information-container">
      <Header />
      <div className="information-hero">
        <img
          src="/images/Header1.png"
          alt="Hero Background"
          className="information-hero-img"
        />
        <h1
          className="information-title"
          style={{
            position: 'absolute',
            top: '64%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
          }}
        >
          KKHC 소개
        </h1>
      </div>
      <div className="content-wrapper">
        <div className="information-content">
          <nav className="information-sidebar">
            <div className="sidebar2-title">KKHC 소개</div>
            <ul>
              <li
                onClick={() => setActiveContent('제공하는 기능')}
                className={activeContent === '제공하는 기능' ? 'active' : ''}
              >
                제공하는 기능
              </li>
              <li
                onClick={() => setActiveContent('사용 기술')}
                className={activeContent === '사용 기술' ? 'active' : ''}
              >
                사용 기술
              </li>
              <li
                onClick={() => setActiveContent('프로그램 구조도')}
                className={activeContent === '프로그램 구조도' ? 'active' : ''}
              >
                기능 구조도
              </li>
            </ul>
          </nav>

          <div className="information-details">
            <div className="sub_head">
              <div className="path">
                <span className="home">홈</span> KCPI 소개
                <span className="arrow">&gt;</span>{' '}
                <strong>{activeContent}</strong>
              </div>
              <div className="sub_title">
                <h2>{activeContent}</h2>
                <p>{renderSubTitle()}</p>
              </div>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Information;
