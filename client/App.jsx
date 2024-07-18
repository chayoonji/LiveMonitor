import React, { useState } from 'react'; // useState를 임포트
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Team from './team';
import Guide from './guide';
import Routine from './routine';
import Board from './board';
import Login from './login';
import Register from './Register';
import Reports1 from './reports1';
import Reports2 from './reports2';
import PDF from './pdf';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleLogin = (user) => {
    setLoggedInUser(user);
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
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reports1" element={<Reports1 />} />
          <Route path="/reports2" element={<Reports2 />} />
          <Route path="/team" element={<Team />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/board" element={<Board loggedInUser={loggedInUser} />} />
          <Route path="/pdf" element={<PDF />} />
          <Route path="/" element={<Home />} /> {/* 수정된 부분 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
