// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Team from './team';
import Guide from './guide';
import Login from './login';
import Routine from './routine';
import Board from './board';
import Register from './Register';
import Reports1 from './reports1';
import Reports2 from './reports2';
import Home from './Home'; // 경로 수정

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthProvider>
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
            <Route path="/routine" element={<Routine />} />
            <Route path="/board" element={<Board loggedInUser={loggedInUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reports1" element={<PrivateRoute element={<Reports1 />} />} />
            <Route path="/reports2" element={<PrivateRoute element={<Reports2 />} />} />
            <Route path="/team" element={<PrivateRoute element={<Team />} />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
