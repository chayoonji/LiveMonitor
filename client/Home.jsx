import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Home() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );

  useEffect(() => {
    // 데이터를 가져오고 업데이트하는 함수
    const fetchDataAndUpdate = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        const chartData = response.data;
        if (chartData.length >= 2) {
          setData1(chartData[0].data);
          setData2(chartData[1].data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // 컴포넌트가 마운트될 때 데이터를 가져오고,
    // 매일 00:00:00에 데이터를 다시 가져오도록 설정
    fetchDataAndUpdate();
    const interval = setInterval(fetchDataAndUpdate, 1000 * 60 * 60 * 24); // 24시간(1일)

    // 언마운트될 때 interval 정리(clean-up)
    return () => clearInterval(interval);
  }, []);

  // 매 분마다 현재 날짜를 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString());
    }, 1000 * 60); // 1분(60초)
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>서버 모니터링</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>가이드</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>모니터링중인 서버</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>2</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>이용자 수</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>33</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>취약점 알림</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>42</h1>
        </div>
      </div>

      <div className="charts">
        <div style={{ textAlign: "center" }}>
          <h4>주통기반 취약점</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={500}
              height={300}
              data={data1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <h4>기타 데이터</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={data2}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Home;
