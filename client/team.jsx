import React from 'react';
import './App.css'; 

const TeamMemberCard = ({ name, role, email, github }) => {
  return (
    // 카드 사이즈를 더 크게 하고, 내용물을 가운데 정렬합니다.
    <div className="card" style={{padding: '30px', backgroundColor: '#2c3e50', margin: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '300px', height: '200px'}}>
      <h3 style={{textAlign: 'center'}}>{name}</h3>
      <p style={{textAlign: 'center'}}>{role}</p>
      {email && <p style={{textAlign: 'center'}}>{email}</p>}
      {github && (
        <a href={github} style={{color: '#3498db', textAlign: 'center'}} target="_blank" rel="noopener noreferrer">
          Github
        </a>
      )}
    </div>
  );
};

const team = () => {
  const teamMembers = [
    { name: '강채린', role: '프론트엔드 & 백엔드 개발자', github: 'https://github.com/QWOFTQ' },
    { name: '김솔', role: '리눅스 스크립트 & 실시간 모니터링 개발' },
    { name: '차윤지', role: '프론트엔드 & 백엔드 개발자', github: 'https://github.com/chayoonji' },
    { name: '홍예진', role: '리눅스 스크립트 & 실시간 모니터링 개발' },
  ];

  return (
    <div className="main-container">
      <h2 style={{color: '#FFFFFF', textAlign: 'center'}}>팀원 소개</h2>
      <div className="main-cards" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} name={member.name} role={member.role} email={member.email} github={member.github} />
        ))}
      </div>
    </div>
  );
};

export default team;
