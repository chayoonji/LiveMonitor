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
        const response = await axios.get(
          `http://localhost:3002/api/solutions/${id}`
        );
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
  const currentSolutions = filteredSolutions.slice(
    indexOfFirstSolution,
    indexOfLastSolution
  );

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  if (!solution) return <div>솔루션 데이터가 없습니다.</div>;

  return (
    <div className="main-container">
      <div
        style={{
          textAlign: 'center',
          marginLeft: '60px',
          marginRight: '60px',
          color: '#E0E0E0',
        }}
      >
        {/* 상단 레이아웃을 flexbox로 조정하여 버튼은 왼쪽, 제목은 가운데로 배치 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() => navigate('/diagnosis')}
            style={{
              padding: '10px',
              backgroundColor: '#1C2331',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: 'auto', // 버튼을 왼쪽에 위치시키기 위해 추가
            }}
          >
            뒤로가기
          </button>
        </div>

        <h1
          style={{ color: '#FFFFFF', fontSize: '24px', marginBottom: '20px' }}
        >
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
          <button
            onClick={() =>
              setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
            }
            disabled={currentPage === 1}
            style={{
              margin: '0 5px',
              padding: '10px',
              backgroundColor: '#1C2331',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            이전
          </button>
          {Array.from(
            { length: Math.ceil(filteredSolutions.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  margin: '0 5px',
                  padding: '10px',
                  backgroundColor:
                    currentPage === index + 1 ? '#2E3A59' : '#1C2331',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                {index + 1}
              </button>
            )
          )}
          <button
            onClick={() =>
              setCurrentPage((prevPage) =>
                Math.min(
                  prevPage + 1,
                  Math.ceil(filteredSolutions.length / itemsPerPage)
                )
              )
            }
            disabled={
              currentPage === Math.ceil(filteredSolutions.length / itemsPerPage)
            }
            style={{
              margin: '0 5px',
              padding: '10px',
              backgroundColor: '#1C2331',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              cursor:
                currentPage ===
                Math.ceil(filteredSolutions.length / itemsPerPage)
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
