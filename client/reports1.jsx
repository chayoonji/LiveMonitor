import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Reports1() {
  const [cpuData, setCpuData] = useState([]);
  const [cpuTime, setCpuTime] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/cpu-data");
        const chartData = response.data;

        if (Array.isArray(chartData) && chartData.length > 0) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(), // Ensure 'hour' exists and is correctly formatted
            "전체 CPU 사용률": item["전체 CPU 사용률"] || 0,
            "P.C CPU 사용률": item["P.C CPU 사용률"] || 0,
            "L.C CPU 사용률": item["L.C CPU 사용률"] || 0,
            "P.C 코어 수": item["P.C 코어 수"] || 0,
            "L.C 코어 수": item["L.C 코어 수"] || 0,
          }));

          setCpuData(formattedData);
        } else {
          console.error("Invalid data format:", chartData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndUpdate();
  }, []);

  useEffect(() => {
    const fetchCpuTimeDataAndUpdate = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/cpu-time");
        const chartData = response.data;

        if (Array.isArray(chartData) && chartData.length > 0) {
          const formattedData = chartData.map((item) => ({
            name: item.hour.toString(), // Ensure 'hour' exists and is correctly formatted
            "사용자 시간": item["사용자 시간"] || 0,
            "시스템 시간": item["시스템 시간"] || 0,
            "유휴 시간": item["유휴 시간"] || 0,
          }));

          setCpuTime(formattedData);
        } else {
          console.error("Invalid data format:", chartData);
        }
      } catch (error) {
        console.error("Error fetching CPU time data:", error);
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
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      <div>
        <div style={{ textAlign: "center" }}>
          <h4 style={{ marginRight: "-110px", marginTop: "-50px" }}>
            CPU 사용률 및 코어 수
          </h4>
          <ResponsiveContainer width={1100} height={250}>
            <LineChart
              data={
                cpuData.length > 0
                  ? cpuData
                  : [
                      {
                        name: "",
                        "전체 CPU 사용률": 0,
                        "P.C CPU 사용률": 0,
                        "L.C CPU 사용률": 0,
                        "P.C 코어 수": 0,
                        "L.C 코어 수": 0,
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

      <div>
        <div style={{ textAlign: "center" }}>
          <h4 style={{ marginRight: "-110px", marginTop: "-2px" }}>
            CPU 시간 비율
          </h4>
          <ResponsiveContainer width={1100} height={250}>
            <LineChart
              data={
                cpuTime.length > 0
                  ? cpuTime
                  : [
                      {
                        name: "",
                        "사용자 시간": 0,
                        "시스템 시간": 0,
                        "유휴 시간": 0,
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
