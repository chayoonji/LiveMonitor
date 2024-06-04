import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Guide from './Guide';
import Login from './Login';
import Register from './Register';
import axios from 'axios';

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
          user={user}
          handleLogout={handleLogout}
        />
        <div className="main-container">
          <Routes>
            <Route
              path="/login"
              element={<Login setIsAuthenticated={handleLogin} />}
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/guide"
              element={isAuthenticated ? <Guide /> : <Navigate to="/login" />}
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Home user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
