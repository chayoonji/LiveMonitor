import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './Diagnosis.css';

const Diagnosis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/data');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching diagnosis data:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // 데이터 처리 및 차트 생성
  const chartData = {
    labels: data.map(item => `Data ${item.id}`),
    datasets: [{
      label: '진단 결과',
      data: data.flatMap(item => item.data.map(d => d.value)),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <div className="diagnosis-container">
      <h1>진단 결과</h1>
      <Bar data={chartData} />
    </div>
  );
};

export default Diagnosis;
