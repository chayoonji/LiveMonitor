import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Team from './team';
import Guide from './guide';
import Login from './login';
import Register from './Register';
import Reports1 from './reports1';
import Reports2 from './reports2';
import PDF from './pdf';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = React.useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <div className="grid-container">
        <Header OpenSidebar={OpenSidebar} />
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <Routes>
          <Route path="/guide" element={<Guide />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reports1" element={<Reports1 />} />
          <Route path="/reports2" element={<Reports2 />} />
          <Route path="/team" element={<Team />} />
          <Route path="/pdf" element={<PDF />} />
          <Route path="/" element={<Guide />} /> {/* 수정된 부분 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
