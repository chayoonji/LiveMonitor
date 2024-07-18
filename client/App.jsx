<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Team from './team';
import Guide from './Guide';
import LoginComponent from './LoginComponent'; // 수정된 부분
import Register from './Register';
import Reports1 from './reports1';
import Reports2 from './reports2';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get('/auth/status')
      .then((response) => {
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error('Error fetching auth status', error);
        setIsAuthenticated(false);
        setUser(null);
      });
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    axios
      .get('/auth/status')
      .then((response) => {
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        }
      })
      .catch((error) => {
        console.error('Error fetching auth status after login', error);
      });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    axios
      .post('/logout')
      .then(() => {
        localStorage.removeItem('isAuthenticated');
      })
      .catch((error) => {
        console.error('Error during logout', error);
      });
  };
=======
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Team from './team';
import Guide from './guide';
import LoginComponent from './LoginComponent';
import Register from './Register';
import Reports1 from './reports1';
import Reports2 from './reports2';
import PDF from './pdf';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = React.useState(false);
>>>>>>> main

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
<<<<<<< HEAD
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
          <Route
            path="/login"
            element={<LoginComponent setIsAuthenticated={setIsAuthenticated} />}
          />{' '}
          {/* 수정된 부분 */}
          <Route path="/register" element={<Register />} />
          <Route path="/reports1" element={<Reports1 />} />
          <Route path="/reports2" element={<Reports2 />} />
          <Route path="/team" element={<Team />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
=======
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
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/team" element={<Team />} />
            <Route path="/pdf" element={<PDF />} />
            <Route path="/" element={<Navigate to="/guide" />} />{' '}
            <Route path="/register" element={<Register />} />
            {/* 기본 경로를 /guide로 리다이렉트 */}
            <Route
              path="/reports1"
              element={
                <PrivateRoute>
                  <Reports1 />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports2"
              element={
                <PrivateRoute>
                  <Reports2 />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
>>>>>>> main
  );
}

export default App;
