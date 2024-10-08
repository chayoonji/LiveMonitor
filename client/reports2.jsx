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

// 숫자 포맷을 처리하는 유틸리티 함수
const parseNumber = (value) => {
  if (typeof value === 'object' && value.$numberDouble) {
    return parseFloat(value.$numberDouble);
  }
  if (typeof value === 'object' && value.$numberInt) {
    return parseInt(value.$numberInt, 10);
  }
  return value;
};

function Reports2() {
  const [Vmemory, setVMemory] = useState([]);
  const [Smemory, setSMemory] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/v-memory');
        const chartData = response.data;

        if (chartData.length >= 3) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(),
            '총 메모리': parseNumber(item['총 메모리']),
            '사용 중인 메모리': parseNumber(item['사용 중인 메모리']),
            '사용 가능한 메모리': parseNumber(item['사용 가능한 메모리']),
            '메모리 사용률': parseNumber(item['메모리 사용률']),
          }));

          setVMemory(formattedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndUpdate();
  }, []);

  useEffect(() => {
    const fetchSMemoryDataAndUpdate = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/S-memory');
        const chartData = response.data;

        console.log('Fetched S-Memory Data:', chartData); // 디버깅용 콘솔 로그

        if (chartData.length > 0) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(),
            '총 스왑 메모리': parseNumber(item['총 스왑 메모리']),
            '사용 중인 스왑 메모리': parseNumber(item['사용 중인 스왑 메모리']),
            '사용 가능한 스왑 메모리': parseNumber(
              item['사용 가능한 스왑 메모리']
            ),
          }));

          setSMemory(formattedData);
        }
      } catch (error) {
        console.error('Error fetching S-Memory data:', error);
      }
    };

    fetchSMemoryDataAndUpdate();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString());
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-container">
      <div
        className="charts"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '90vh',
          paddingTop: '20px',
        }}
      >
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ textAlign: 'center', width: '70%' }}>
            <h4 style={{ marginBottom: '10px' }}>가상 메모리 사용 정보</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={
                  Vmemory.length > 0
                    ? Vmemory
                    : [
                        {
                          name: '',
                          '총 메모리': 0,
                          '사용 중인 메모리': 0,
                          '사용 가능한 메모리': 0,
                          '메모리 사용률': 0,
                        },
                      ]
                }
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="총 메모리"
                  stroke="#ff7300"
                  dot={false}
                  connectNulls={true}
                />
                <Line
                  type="monotone"
                  dataKey="사용 중인 메모리"
                  stroke="#82ca9d"
                  dot={false}
                  connectNulls={true}
                />
                <Line
                  type="monotone"
                  dataKey="사용 가능한 메모리"
                  stroke="#8884d8"
                  dot={false}
                  connectNulls={true}
                />
                <Line
                  type="monotone"
                  dataKey="메모리 사용률"
                  stroke="#0088FE"
                  dot={false}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          <div style={{ textAlign: 'center', width: '70%' }}>
            <h4 style={{ marginBottom: '10px' }}>스왑 메모리 사용 정보</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={
                  Smemory.length > 0
                    ? Smemory
                    : [
                        {
                          name: '',
                          '총 스왑 메모리': 0,
                          '사용 중인 스왑 메모리': 0,
                          '사용 가능한 스왑 메모리': 0,
                        },
                      ]
                }
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="총 스왑 메모리"
                  stroke="#8884d8"
                  dot={false}
                  connectNulls={true}
                />
                <Line
                  type="monotone"
                  dataKey="사용 중인 스왑 메모리"
                  stroke="#82ca9d"
                  dot={false}
                  connectNulls={true}
                />
                <Line
                  type="monotone"
                  dataKey="사용 가능한 스왑 메모리"
                  stroke="#ff7300"
                  dot={false}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports2;
