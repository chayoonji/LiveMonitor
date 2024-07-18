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

function Reports1() {
  const [cpuData, setCpuData] = useState([]);
  const [cpuTime, setCpuTime] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get('http://localhost:3001/api/cpu-data');
=======
        const response = await axios.get("http://localhost:3001/api/cpu-data");
>>>>>>> main
        const chartData = response.data;

        if (chartData.length >= 3) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(),
<<<<<<< HEAD
            '전체 CPU 사용률': item['전체 CPU 사용률'],
            'P.C CPU 사용률': item['P.C CPU 사용률'],
            'L.C CPU 사용률': item['L.C CPU 사용률'],
            'P.C 코어 수': item['P.C 코어 수'],
            'L.C 코어 수': item['L.C 코어 수'],
=======
            "전체 CPU 사용률": item["전체 CPU 사용률"],
            "P.C CPU 사용률": item["P.C CPU 사용률"],
            "L.C CPU 사용률": item["L.C CPU 사용률"],
            "P.C 코어 수": item["P.C 코어 수"],
            "L.C 코어 수": item["L.C 코어 수"],
>>>>>>> main
          }));

          setCpuData(formattedData);
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
    const fetchCpuTimeDataAndUpdate = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get('http://localhost:3001/api/cpu-time');
=======
        const response = await axios.get("http://localhost:3001/api/cpu-time");
>>>>>>> main
        const chartData = response.data;

        if (chartData.length > 0) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(),
<<<<<<< HEAD
            '사용자 시간': item['사용자 시간'],
            '시스템 시간': item['시스템 시간'],
            '유휴 시간': item['유휴 시간'],
=======
            "사용자 시간": item["사용자 시간"],
            "시스템 시간": item["시스템 시간"],
            "유휴 시간": item["유휴 시간"],
>>>>>>> main
          }));

          setCpuTime(formattedData);
        }
      } catch (error) {
<<<<<<< HEAD
        console.error('Error fetching CPU time data:', error);
=======
        console.error("Error fetching CPU time data:", error);
>>>>>>> main
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
<<<<<<< HEAD
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      <div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ marginRight: '-110px', marginTop: '-50px' }}>
=======
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      <div>
        <div style={{ textAlign: "center" }}>
          <h4 style={{ marginRight: "-110px", marginTop: "-50px" }}>
>>>>>>> main
            CPU 사용률 및 코어 수
          </h4>
          <ResponsiveContainer width={1100} height={250}>
            <LineChart
              data={
                cpuData.length > 0
                  ? cpuData
                  : [
                      {
<<<<<<< HEAD
                        name: '',
                        '전체 CPU 사용률': 0,
                        'P.C CPU 사용률': 0,
                        'L.C CPU 사용률': 0,
                        'P.C 코어 수': 0,
                        'L.C 코어 수': 0,
=======
                        name: "",
                        "전체 CPU 사용률": 0,
                        "P.C CPU 사용률": 0,
                        "L.C CPU 사용률": 0,
                        "P.C 코어 수": 0,
                        "L.C 코어 수": 0,
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

      {/* 새로운 그래프 추가 */}
      <div>
<<<<<<< HEAD
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ marginRight: '-110px', marginTop: '-2px' }}>
=======
        <div style={{ textAlign: "center" }}>
          <h4 style={{ marginRight: "-110px", marginTop: "-2px" }}>
>>>>>>> main
            CPU 시간 비율
          </h4>
          <ResponsiveContainer width={1100} height={250}>
            <LineChart
              data={
                cpuTime.length > 0
                  ? cpuTime
                  : [
                      {
<<<<<<< HEAD
                        name: '',
                        '사용자 시간': 0,
                        '시스템 시간': 0,
                        '유휴 시간': 0,
=======
                        name: "",
                        "사용자 시간": 0,
                        "시스템 시간": 0,
                        "유휴 시간": 0,
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
