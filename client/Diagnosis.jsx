import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const Diagnosis = () => {
  const [data, setData] = useState([]);
  const [textData, setTextData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(4); // 페이지당 항목 수를 4로 설정
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState([]);
  const navigate = useNavigate(); // 프로그래밍적으로 네비게이션

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataResponse, textResponse, diagnosisResponse] =
          await Promise.all([
            axios.get('http://localhost:3002/api/data'),
            axios.get(
              `http://localhost:3002/api/search-text-data?page=${page}&limit=${limit}&query=${query}`
            ),
            axios.get('http://localhost:3002/api/diagnosis-results'),
          ]);

        setData(dataResponse.data);
        setTextData(textResponse.data.data);
        setTotalPages(textResponse.data.totalPages);
        setDiagnosisResults(diagnosisResponse.data);
      } catch (err) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, query, isSearching]);

  const handleSearch = () => {
    setPage(1); // 검색 시 첫 페이지로 리셋
    setIsSearching(true); // 검색 모드 활성화
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  if (data.length === 0) return <div>데이터가 없습니다.</div>;

  // 차트 데이터 변환
  const chartData = data[0]?.data.map((item) => ({
    name: item.name,
    value: item.value,
  })) || [];

  const handleViewSolution = (id) => {
    navigate(`/solution/${id}`); // 취약한 결과의 ID를 사용해 솔루션 페이지로 이동
  };

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
        진단 결과
      </h1>

      {/* 검색 */}
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            width: '300px',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '4px',
            backgroundColor: '#6200EA',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          검색
        </button>
      </div>

      {/* 텍스트 데이터 테이블 */}
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
              {textData[0] &&
                Object.keys(textData[0])
                  .filter((key) => key !== '_id')
                  .sort((a, b) => (a === 'id' ? -1 : b === 'id' ? 1 : 0))
                  .map((key, index) => (
                    <th key={index} style={{ padding: '10px' }}>
                      {key}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {textData.map((item, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: item.결과 === '취약' ? '#B71C1C' : '#303F9F',
                  cursor: item.결과 === '취약' ? 'pointer' : 'default',
                }}
                onClick={() =>
                  item.결과 === '취약' && handleViewSolution(item.id)
                }
              >
                {Object.entries(item)
                  .filter(([key]) => key !== '_id')
                  .sort(([aKey], [bKey]) =>
                    aKey === 'id' ? -1 : bKey === 'id' ? 1 : 0
                  )
                  .map(([key, value], i) => (
                    <td
                      key={i}
                      style={{
                        padding: '10px',
                        color:
                          key === '결과' && value === '취약'
                            ? '#FFFFFF'
                            : '#E0E0E0',
                      }}
                    >
                      {value}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 컨트롤 */}
        {totalPages > 1 && (
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#E0E0E0',
            }}
          >
            <button
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabled={page === 1}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                borderRadius: '4px',
                backgroundColor: '#6200EA',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              이전 페이지
            </button>
            <button
              onClick={() =>
                setPage((prevPage) => Math.min(prevPage + 1, totalPages))
              }
              disabled={page === totalPages}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                backgroundColor: '#6200EA',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              다음 페이지
            </button>
            <p style={{ marginLeft: '10px' }}>
              페이지 {page} / {totalPages}
            </p>
          </div>
        )}
      </div>

      {/* 총 결과 */}
      <h3 style={{ marginBottom: '20px', color: '#FFFFFF' }}>총 결과</h3>

      {/* 라인 차트 */}
      <div
        style={{
          maxWidth: '1200px',
          height: '300px',
          margin: '0 auto',
          backgroundColor: '#1A237E',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#B0BEC5" />
            <XAxis dataKey="name" stroke="#E0E0E0" />
            <YAxis stroke="#E0E0E0" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FFEB3B"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Diagnosis;
