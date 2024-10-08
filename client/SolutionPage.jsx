// Solutions.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가

const Solutions = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 내비게이션 함수 생성
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/solutions/${id}`);
        setSolution(response.data);
      } catch (err) {
        console.error('솔루션을 가져오는 중 오류가 발생했습니다:', err);
        setError('솔루션을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [id]);

  const handleBack = () => {
    navigate('/diagnosis'); // /diagnosis로 이동
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  if (!solution) return <div>솔루션 데이터가 없습니다.</div>;

  return (
    <div className="main-container">
    <div style={{ padding: '20px', color: '#E0E0E0' }}>
      <h1 style={{ color: '#FFFFFF' }}>조치 방법</h1>
      <button onClick={handleBack} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#2E3A59', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}>
        뒤로가기
      </button>
      <table
        border="1"
        style={{ margin: '0 auto', width: '50%', textAlign: 'left', borderCollapse: 'collapse', color: '#E0E0E0' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#2E3A59', color: '#FFFFFF' }}>
            <th style={{ padding: '10px' }}>항목</th>
            <th style={{ padding: '10px' }}>내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px' }}>ID</td>
            <td style={{ padding: '10px' }}>{solution.id}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>조치 방법</td>
            <td style={{ padding: '10px' }}>{solution.조치방법}</td>
          </tr>
          {/* 여기에 더 많은 항목을 추가할 수 있습니다. */}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Solutions;