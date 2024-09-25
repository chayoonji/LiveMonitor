import React, { useState, useEffect } from 'react';
import './Home.css'; // CSS 파일

const Home = () => {
  const images = [
    '/images/0105030100_01.jpg',
    '/images/importance-of-404-error-page-6.png',
    '/images/2020043001700_1.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="slider-container">
      <div className="background">
        <img
          src={images[currentIndex]}
          alt={`Background ${currentIndex}`}
          className="background-image"
        />
      </div>
      <div className="slider">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${
              index === currentIndex
                ? 'current'
                : index === (currentIndex + 1) % images.length
                ? 'next'
                : 'previous'
            }`}
          >
            <img src={image} alt={`Slide ${index}`} className="slide-image" />
          </div>
        ))}
        <button className="prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Home;
