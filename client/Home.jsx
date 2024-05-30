import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function Home() {
  const [data, setData] = useState([]);

  // 데이터 로드 및 변환
  useEffect(() => {
    fetch("http://localhost:3001/api/data")
      .then((response) => response.json())
      .then((data) => {
        // MongoDB 데이터를 Recharts 데이터 형식으로 변환
        const transformedData = data.map((item, index) => ({
          웹: parseInt(item["웹"]), // '웹' 값을 사용
          서버: parseInt(item["서버"]), // '서버' 값을 사용
        }));

        setData(transformedData);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>서버 모니터링</h3>
      </div>

      <div className="main-cards">
        {/* 카드 컴포넌트 */}
        <Card title="가이드" icon={<BsFillArchiveFill />} />
        <Card
          title="모니터링중인 서버"
          icon={<BsFillGrid3X3GapFill />}
          value="2"
        />
        <Card title="이용자 수" icon={<BsPeopleFill />} value="33" />
        <Card title="취약점 알림" icon={<BsFillBellFill />} value="42" />
      </div>

      <div className="charts">
        {/* 막대 차트 */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.map((item, index) => ({
              ...item,
              name: `주통기반 취약점 현황`,
            }))}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="웹" fill="#8884d8" />
            <Bar dataKey="서버" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        {/* 선형 차트 */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data.map((item, index) => ({
              ...item,
              name: `실시간 모니터링 현황`,
            }))}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="웹"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="서버" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

// 카드 컴포넌트 정의
function Card({ title, icon, value }) {
  return (
    <div className="card">
      <div className="card-inner">
        <h3>{title}</h3>
        {icon}
      </div>
      {value && <h1>{value}</h1>}
    </div>
  );
}

export default Home;
