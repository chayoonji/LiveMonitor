import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Team from './team';
import Guide from './guide';
import LoginComponent from './LoginComponent'; // 새 로그인 컴포넌트
import Login from './login'; // 수정된 부분
import Register from './Register'; // 수정된 부분
import Reports1 from './reports1'; // 수정된 부분
import Reports2 from './reports2';


function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 로그인 상태를 확인
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <div className="grid-container">
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
        <Routes>
          <Route path="/guide" element={<Guide />} />

          <Route path="/login" element={<Login />} /> {/* 수정된 부분 */}
          <Route path="/register" element={<Register />} /> {/* 수정된 부분 */}
          <Route path="/reports1" element={<Reports1 />} /> {/* 수정된 부분 */}
          <Route path="/reports2" element={<Reports2 />} /> {/* 수정된 부분 */}
          <Route path="/team" element={<Team />} /> {/* 수정된 부분 */}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
