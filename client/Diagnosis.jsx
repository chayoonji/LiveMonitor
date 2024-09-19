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
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(4);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null); // 선택된 조치방법
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataResponse, textResponse, solutionsResponse] =
          await Promise.all([
            axios.get('http://localhost:3002/api/data'),
            axios.get(
              `http://localhost:3002/api/search-text-data?page=${page}&limit=${limit}&query=${query}`
            ),
            axios.get('http://localhost:3002/api/solutions')
          ]);

        setData(dataResponse.data);
        setTextData(textResponse.data.data);
        setTotalPages(textResponse.data.totalPages);
        setSolutions(solutionsResponse.data);
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
    setPage(1);
    setIsSearching(true);
  };

  const handleViewSolution = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/solutions`);
      setSelectedSolution(response.data);
      navigate(`/solutions`);
    } catch (err) {
      console.error('솔루션을 가져오는 중 오류가 발생했습니다:', err);
      setError('솔루션을 가져오는 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  if (textData.length === 0) return <div>데이터가 없습니다.</div>;

  const tableHeaders = textData[0] ? Object.keys(textData[0]) : [];
  const tableRows = textData.map((item, index) => (
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
      {tableHeaders.map((header, idx) => (
        <td
          key={idx}
          style={{
            padding: '10px',
            color: header === '결과' && item[header] === '취약' ? '#FFFFFF' : '#E0E0E0',
          }}
        >
          {item[header]}
        </td>
      ))}
    </tr>
  ));

  const chartData = data[0]?.data.map((item) => ({
    name: item.name,
    value: item.value,
  })) || [];

  return (
    <div
      style={{
        textAlign: 'center',
        marginLeft: '60px',
        marginRight: '60px',
        color: '#E0E0E0',
      }}
    >
      {/* 뒤로가기 버튼 */}
      <div
        style={{
          marginBottom: '20px',
          textAlign: 'left',
        }}
      >
        <button
          onClick={() => navigate('/Board')}
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
          뒤로가기
        </button>
      </div>

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
              {tableHeaders.map((header, index) => (
                <th key={index} style={{ padding: '10px' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Diagnosis;
