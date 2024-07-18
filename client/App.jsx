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

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

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
  );
}

export default App;
