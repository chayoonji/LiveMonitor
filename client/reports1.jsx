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

// 환경 변수를 사용하여 API URL을 설정
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Reports1() {
  const [cpuData, setCpuData] = useState([]);
  const [cpuTime, setCpuTime] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/cpu-data`);
        const chartData = response.data;

        if (chartData.length >= 3) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(),
            '전체 CPU 사용률': item['전체 CPU 사용률'],
            'P.C CPU 사용률': item['P.C CPU 사용률'],
            'L.C CPU 사용률': item['L.C CPU 사용률'],
            'P.C 코어 수': item['P.C 코어 수'],
            'L.C 코어 수': item['L.C 코어 수'],
          }));

          setCpuData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndUpdate();
  }, []);

  useEffect(() => {
    const fetchCpuTimeDataAndUpdate = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/cpu-time`);
        const chartData = response.data;

        if (chartData.length > 0) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(),
            '사용자 시간': item['사용자 시간'],
            '시스템 시간': item['시스템 시간'],
            '유휴 시간': item['유휴 시간'],
          }));

          setCpuTime(formattedData);
        }
      } catch (error) {
        console.error('Error fetching CPU time data:', error);
      }
    };

    fetchCpuTimeDataAndUpdate();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString());
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
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
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', width: '70%' }}>
          <h4 style={{ marginBottom: '10px' }}>CPU 사용률 및 코어 수</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={
                cpuData.length > 0
                  ? cpuData
                  : [
                      {
                        name: '',
                        '전체 CPU 사용률': 0,
                        'P.C CPU 사용률': 0,
                        'L.C CPU 사용률': 0,
                        'P.C 코어 수': 0,
                        'L.C 코어 수': 0,
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
                dataKey="전체 CPU 사용률"
                stroke="#ff7300"
                dot={false}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="P.C CPU 사용률"
                stroke="#82ca9d"
                dot={false}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="L.C CPU 사용률"
                stroke="#8884d8"
                dot={false}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="P.C 코어 수"
                stroke="#0088FE"
                dot={false}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="L.C 코어 수"
                stroke="#00C49F"
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
          <h4 style={{ marginBottom: '10px' }}>CPU 시간 비율</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={
                cpuTime.length > 0
                  ? cpuTime
                  : [
                      {
                        name: '',
                        '사용자 시간': 0,
                        '시스템 시간': 0,
                        '유휴 시간': 0,
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
                dataKey="사용자 시간"
                stroke="#8884d8"
                dot={false}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="시스템 시간"
                stroke="#82ca9d"
                dot={false}
                connectNulls={true}
              />
              <Line
                type="monotone"
                dataKey="유휴 시간"
                stroke="#ff7300"
                dot={false}
                connectNulls={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Reports1;
