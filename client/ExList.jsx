import React, { useState } from 'react';
import './ExList.css';

const data = [
  {
    title: '[전자 제조] 주 단위 운영체제 구축 및 실행력 강화',
    description:
      '시장 변화에 적기 대응하는 수요 관리와 Single Plan 운영을 통한 계획적 실행, 그리고 구매 프로세스와 운영 Rule 표준화가 가능합니다.',
    image: '/images/ExImage.png',
    downloadLink: '#',
  },
  {
    title: '[화학 제조] 시스템 경영 체제 구축',
    description:
      '화학 제조 공정의 체계적인 관리와 효율적인 운영을 위한 시스템 경영 체제 구축.',
    image: '/images/feature3.png',
    downloadLink: '#',
  },
  {
    title: '[수주 업종] 프로젝트 통합 관리 고도화',
    description: '프로젝트 관리와 통합 운영 체계의 고도화를 통해 수익성 증대.',
    image: '/images/feature3.png',
    downloadLink: '#',
  },
  {
    title: '[유통/서비스] 경영계획과 동기화된 운영계획 수립',
    description: '유통 및 서비스 산업에서의 경영계획과 동기화된 운영계획 수립.',
    image: '/images/feature3.png',
    downloadLink: '#',
  },
];

const ExList = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  return (
    <div className="exlist-wrapper">
      {/* 왼쪽 상단에 위치할 영역 */}
      <div className="exlist-header">
        <h3 className="subtitle">삼성SDS Smart ERP의 가능성</h3>
        <hr className="title-separator" />
      </div>

      {/* 기존 컨텐츠 */}
      <div className="exlist-container clearfix">
        <div className="exlist-left">
          <hr className="title-separator" />
          <ul>
            {data.map((item, index) => (
              <li
                key={index}
                className={index === currentIndex ? 'active' : ''}
                onClick={() => setCurrentIndex(index)}
              >
                {item.title}
              </li>
            ))}
          </ul>
          <div className="exlist-navigation">
            <button onClick={handlePrevious}>{'<'}</button>
            <span>
              {currentIndex + 1} / {data.length}
            </span>
            <button onClick={handleNext}>{'>'}</button>
          </div>
        </div>

        <div className="exlist-right">
          <div className="exlist-description-box">
            <img
              src={data[currentIndex].image}
              alt={data[currentIndex].title}
            />
          </div>
        </div>

        <div className="exlist-mainfont">
          <h3>{data[currentIndex].title}</h3>
          <p>{data[currentIndex].description}</p>
          <a href={data[currentIndex].downloadLink}>다운로드 </a>
        </div>

        <img
          className="gray-image"
          src="/images/gray.png"
          alt="Gray decoration"
        />
      </div>
    </div>
  );
};

export default ExList;
