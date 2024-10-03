import React from 'react';
import './HowAbout.css';

const HowAbout = () => {
  return (
    <section className="how-about-section">
      <div className="how-about-content">
        <div className="text-box">
          <h3>취약점 점검</h3>
          <p>Vulnerability Assessment</p>
          <br></br>
        </div>

        <div className="image-container">
          <img
            src="/images/feature4.png"
            alt="통합 모니터링"
            className="feature-image"
          />
          <div className="image-caption">
            <h4>통합 모니터링</h4>
            <p>
              다양한 서비스를 제공하여<br></br> 통합 모니터링을 할 수 있습니다.
              <br></br>
            </p>
          </div>
        </div>

        <div className="image-container left-bottom">
          <img
            src="/images/엠블렘.png"
            alt="SaaS 서비스"
            className="feature-image"
          />
          <div className="image-caption">
            <h4>
              Linux 취약점 진단<br></br>
            </h4>
            <p>
              주요정보통신기반시설 취약점 분석 평가 가이드에 맞춰 검사합니다.
            </p>
          </div>
        </div>

        {/* 세 번째 이미지 추가 */}
        <div className="image-container right-bottom">
          <img
            src="/images/feature3.png"
            alt="실시간 조회"
            className="feature-image"
          />
          <div className="image-caption">
            <h4>간편한 조회</h4>
            <p>
              웹 사이트를 통해 간편하게 <br></br>검사 결과를 받아 볼 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowAbout;
