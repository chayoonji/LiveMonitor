import React from 'react';
import './Team.css';
import Header from './Header';
import Footer from './Footer';

const Team = () => {
  const webTeam = [
    {
      name: '강채린',
      image: '/images/Team1.png',
      position: '프론트엔드, 백엔드 개발',
    },
    {
      name: '차윤지',
      image: '/images/Team2.png',
      position: '프론트엔드, 백엔드 개발',
    },
  ];

  const linuxTeam = [
    {
      name: '김 솔',
      image: '/images/Team3.png',
      position: '리눅스 스크립트 & 실시간 모니터링 개발',
    },
    {
      name: '홍예진',
      image: '/images/Team4.png',
      position: '리눅스 스크립트 & 실시간 모니터링 개발',
    },
  ];

  const [selectedTeam, setSelectedTeam] = React.useState('웹');

  const teamMembers = selectedTeam === '웹' ? webTeam : linuxTeam;

  return (
    <div className="team-page">
      <Header />
      <div className="image-overlay">
        <img src="/images/꼼수.png" alt="Overlay" className="overlay-image" />
      </div>
      <div className="team-content">
        <h1 className="team-title">팀원 소개</h1>
        <div className="team-buttons">
          <button
            className={`team-button ${selectedTeam === '웹' ? 'active' : ''}`}
            onClick={() => setSelectedTeam('웹')}
          >
            웹
          </button>
          <button
            className={`team-button ${
              selectedTeam === '리눅스' ? 'active' : ''
            }`}
            onClick={() => setSelectedTeam('리눅스')}
          >
            리눅스
          </button>
        </div>
        <div className="team-members">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <img
                src={member.image}
                alt={member.name}
                className="team-member-image"
              />
              <div className="team-member-info">
                <h2 className="team-member-name">{member.name}</h2>
                <p className="team-member-position">{member.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Team;
