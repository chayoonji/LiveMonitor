import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";

function JuTongGiBanChuiYakJum() {
  const [data1, setData1] = useState([]);

  useEffect(() => {
    // 데이터를 가져오고 업데이트하는 함수
    const fetchDataAndUpdate = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        const chartData = response.data;

        if (chartData.length >= 1) {
          const formattedData1 = chartData[0].data.map((item) => ({
            name: item.name,
            "주통기반 취약점": item.value,
          }));

          setData1(formattedData1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndUpdate();
  }, []);

  return (
    <div
      className="chart"
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <div>
        <div style={{ textAlign: "center" }}>
          <h4>주통기반 취약점</h4>
          <ResponsiveContainer width={800} height={300}>
            <BarChart
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
              <Bar dataKey="주통기반 취약점" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Home() {
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

      {/* 주통기반 취약점 차트 추가 */}
      <JuTongGiBanChuiYakJum />
    </main>
  );
}

export default Home;
