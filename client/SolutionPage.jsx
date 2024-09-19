import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchId, setSearchId] = useState('');
  
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/solutions');
        setSolutions(response.data);
      } catch (err) {
        console.error('솔루션을 불러오는 중 오류가 발생했습니다:', err);
        setError('솔루션을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
    setCurrentPage(1); // 검색 시 페이지를 처음으로 되돌림
  };

  const filteredSolutions = solutions.filter((solution) => {
    // 검색 아이디가 비어있으면 모든 데이터를 반환
    if (!searchId) return true;
    // 검색 아이디가 숫자일 경우, 정확히 일치하는 ID만 반환
    return solution.id === parseInt(searchId, 10);
  });

  // 페이지네이션
  const indexOfLastSolution = currentPage * itemsPerPage;
  const indexOfFirstSolution = indexOfLastSolution - itemsPerPage;
  const currentSolutions = filteredSolutions.slice(indexOfFirstSolution, indexOfLastSolution);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  if (solutions.length === 0) return <div>솔루션 데이터가 없습니다.</div>;

  return (
    <div
      style={{
        textAlign: 'center',
        marginLeft: '60px',
        marginRight: '60px',
        color: '#E0E0E0',
      }}
    >
      <h1 style={{ color: '#FFFFFF', fontSize: '24px', marginBottom: '20px' }}>
        솔루션 목록
      </h1>

      <input
        type="number"
        value={searchId}
        onChange={handleSearchChange}
        placeholder="ID 검색"
        style={{ marginBottom: '20px', padding: '10px', fontSize: '16px' }}
      />

      {/* 솔루션 데이터 테이블 */}
      <div
        style={{ marginBottom: '50px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <table
          border="1"
          style={{
            margin: '0 auto',
            width: '100%',
            textAlign: 'left',
            borderCollapse: 'collapse',
            color: '#E0E0E0',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#2E3A59', color: '#FFFFFF' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>조치방법</th>
            </tr>
          </thead>
          <tbody>
            {currentSolutions.map((solution) => (
              <tr key={solution.id}>
                <td style={{ padding: '10px' }}>{solution.id}</td>
                <td style={{ padding: '10px' }}>{solution.조치방법}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div>
        {Array.from({ length: Math.ceil(filteredSolutions.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              margin: '0 5px',
              padding: '10px',
              backgroundColor: currentPage === index + 1 ? '#2E3A59' : '#1C2331',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Solutions;