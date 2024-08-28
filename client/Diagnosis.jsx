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
import { Link, useNavigate } from 'react-router-dom';

const Diagnosis = () => {
  const [data, setData] = useState([]);
  const [textData, setTextData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // 페이지당 항목 수
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState([]);
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataResponse, textResponse, diagnosisResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/data'),
          axios.get(`http://localhost:3001/api/search-text-data?page=${page}&limit=${isSearching ? limit : 4}&query=${query}`),
          axios.get('http://localhost:3001/api/diagnosis-results') // 취약한 결과를 가져오는 API 호출
        ]);

        console.log('Fetched data:', dataResponse.data);
        setData(dataResponse.data);

        console.log('Fetched text data:', textResponse.data);
        setTextData(textResponse.data.data);
        setTotalPages(textResponse.data.totalPages);

        console.log('Fetched diagnosis results:', diagnosisResponse.data);
        setDiagnosisResults(diagnosisResponse.data);

      } catch (err) {
        console.error('Error fetching data:', err);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (data.length === 0) return <div>데이터가 없습니다.</div>;

  // Transform data to match chart format
  const chartData = data[0].data.map(item => ({
    name: item.name,
    value: item.value
  }));

  console.log('Chart Data:', chartData);

  const handleViewSolution = (id) => {
    navigate(`/solution/${id}`); // Navigate to the solution page with the result ID
  };

  return (
    <div style={{ textAlign: "center", marginLeft: '50px' }}>
      <h1>진단 결과</h1>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: '10px', fontSize: '16px', marginLeft: '10px' }}
        >
          검색
        </button>
      </div>

      {/* Text Data Table */}
      <div style={{ marginBottom: '50px', width: '1100px', margin: '0 auto' }}>
        <table border="1" style={{ margin: '0 auto', width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              {/* Filter out _id and move id to the first column */}
              {textData[0] && Object.keys(textData[0])
                .filter(key => key !== '_id')
                .sort((a, b) => (a === 'id' ? -1 : b === 'id' ? 1 : 0))
                .map((key, index) => (
                  <th key={index} style={{ padding: '10px' }}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {textData.map((item, index) => (
              <tr 
                key={index} 
                style={{ 
                  backgroundColor: item.결과 === '취약' ? 'red' : 'white', 
                  cursor: item.결과 === '취약' ? 'pointer' : 'default' 
                }}
                onClick={() => item.결과 === '취약' && handleViewSolution(item.id)}
              >
                {Object.entries(item)
                  .filter(([key]) => key !== '_id')
                  .sort(([aKey], [bKey]) => (aKey === 'id' ? -1 : bKey === 'id' ? 1 : 0))
                  .map(([key, value], i) => (
                    <td key={i} style={{ padding: '10px', color: key === '결과' && value === '취약' ? 'white' : 'black' }}>
                      {value}
                    </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {isSearching && totalPages > 1 && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
              disabled={page === 1}
              style={{ padding: '10px 20px', marginRight: '10px' }}
            >
              이전 페이지
            </button>
            <button
              onClick={() => setPage(prevPage => Math.min(prevPage + 1, totalPages))}
              disabled={page === totalPages}
              style={{ padding: '10px 20px' }}
            >
              다음 페이지
            </button>
            <p>페이지 {page} / {totalPages}</p>
          </div>
        )}
      </div>

      {/* Total Results */}
      <h3 style={{ marginBottom: '20px' }}>총 결과</h3>

      {/* Line Chart */}
      <div style={{ width: '1100px', height: '250px', margin: '0 auto' }}>
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

      {/* Removed Vulnerability Results Section */}
    </div>
  );
};

export default Diagnosis;
