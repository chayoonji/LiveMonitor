import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Team from './team';
import Guide from './guide';
import Login from './login'; // 수정된 부분
import Register from './Register'; // 수정된 부분
import Reports1 from './reports1'; // 수정된 부분
import Reports2 from './reports2'; // 수정된 부분
import PDF from './pdf'; // 수정된 부분



function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = React.useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <div className="grid-container">
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <Routes>
          <Route path="/guide" element={<Guide />} />
          <Route path="/login" element={<Login />} /> {/* 수정된 부분 */}
          <Route path="/register" element={<Register />} /> {/* 수정된 부분 */}
          <Route path="/reports1" element={<Reports1 />} /> {/* 수정된 부분 */}
          <Route path="/reports2" element={<Reports2 />} /> {/* 수정된 부분 */}
          <Route path="/team" element={<Team />} /> {/* 수정된 부분 */}
          <Route path="/pdf" element={<PDF />} /> {/* 수정된 부분 */}
      
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
