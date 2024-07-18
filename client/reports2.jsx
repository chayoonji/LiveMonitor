<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
=======
import React, { useEffect, useState } from "react";
import axios from "axios";
>>>>>>> main
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
<<<<<<< HEAD
} from 'recharts';
=======
} from "recharts";
>>>>>>> main

function Reports2() {
  const [Vmemory, setVMemory] = useState([]);
  const [Smemory, setSMemory] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get('http://localhost:3001/api/v-memory');
=======
        const response = await axios.get("http://localhost:3001/api/v-memory");
>>>>>>> main
        const chartData = response.data;

        if (chartData.length >= 3) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(),
<<<<<<< HEAD
            '총 메모리': item['총 메모리'],
            '사용 중인 메모리': item['사용 중인 메모리'],
            '사용 가능한 메모리': item['사용 가능한 메모리'],
            '메모리 사용률': item['메모리 사용률'],
=======
            "총 메모리": item["총 메모리"],
            "사용 중인 메모리": item["사용 중인 메모리"],
            "사용 가능한 메모리": item["사용 가능한 메모리"],
            "메모리 사용률": item["메모리 사용률"],
>>>>>>> main
          }));

          setVMemory(formattedData);
        }
      } catch (error) {
<<<<<<< HEAD
        console.error('Error fetching data:', error);
=======
        console.error("Error fetching data:", error);
>>>>>>> main
      }
    };

    fetchDataAndUpdate();
  }, []);

  useEffect(() => {
    const fetchSMemoryDataAndUpdate = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get('http://localhost:3001/api/S-memory');
=======
        const response = await axios.get("http://localhost:3001/api/S-memory");
>>>>>>> main
        const chartData = response.data;

        if (chartData.length > 0) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(),
<<<<<<< HEAD
            '총 스왑 메모리': item['총 스왑 메모리'],
            '사용 중인 스왑 메모리': item['사용 중인 스왑 메모리'],
            '사용 가능한 스왑 메모리': item['사용 가능한 스왑 메모리'],
=======
            "총 스왑 메모리": item["총 스왑 메모리"],
            "사용 중인 스왑 메모리": item["사용 중인 스왑 메모리"],
            "사용 가능한 스왑 메모리": item["사용 가능한 스왑 메모리"],
>>>>>>> main
          }));

          setSMemory(formattedData);
        }
      } catch (error) {
<<<<<<< HEAD
        console.error('Error fetching S-Memory data:', error);
=======
        console.error("Error fetching S-Memory data:", error);
>>>>>>> main
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
    <div
      className="charts"
<<<<<<< HEAD
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      <div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ marginRight: '-110px', marginTop: '-50px' }}>
            가상 메모리 사용 정보
=======
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      <div>
        <div style={{ textAlign: "center" }}>
          <h4 style={{ marginRight: "-110px", marginTop: "-50px" }}>
          가상 메모리 사용 정보
>>>>>>> main
          </h4>
          <ResponsiveContainer width={1100} height={250}>
            <LineChart
              data={
                Vmemory.length > 0
                  ? Vmemory
                  : [
                      {
<<<<<<< HEAD
                        name: '',
                        '총 메모리': 0,
                        '사용 중인 메모리': 0,
                        '사용 가능한 메모리': 0,
                        '메모리 사용률': 0,
=======
                        name: "",
                        "총 메모리": 0,
                        "사용 중인 메모리": 0,
                        "사용 가능한 메모리": 0,
                        "메모리 사용률": 0,
>>>>>>> main
                      },
                    ]
              }
              margin={{
                top: 0,
                right: 0,
                left: 110,
                bottom: 5,
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

      {/* 새로운 그래프 추가 */}
      <div>
<<<<<<< HEAD
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ marginRight: '-110px', marginTop: '-2px' }}>
            스왑 메모리 사용 정보
=======
        <div style={{ textAlign: "center" }}>
          <h4 style={{ marginRight: "-110px", marginTop: "-2px" }}>
          스왑 메모리 사용 정보
>>>>>>> main
          </h4>
          <ResponsiveContainer width={1100} height={250}>
            <LineChart
              data={
                Smemory.length > 0
                  ? Smemory
                  : [
                      {
<<<<<<< HEAD
                        name: '',
                        '총 스왑 메모리': 0,
                        '사용 중인 스왑 메모리': 0,
                        '사용 가능한 스왑 메모리': 0,
=======
                        name: "",
                        "총 스왑 메모리": 0,
                        "사용 중인 스왑 메모리": 0,
                        "사용 가능한 스왑 메모리": 0,
>>>>>>> main
                      },
                    ]
              }
              margin={{
                top: 0,
                right: 0,
                left: 110,
                bottom: 5,
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
  );
}

export default Reports2;
