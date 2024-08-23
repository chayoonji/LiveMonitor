import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import Board from './Boardpost'; // Board 컴포넌트를 import 합니다
import PostDetail from './PostDetail';

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
            <Route path="/" element={<Navigate to="/guide" />} /> {/* 기본 경로를 /guide로 리다이렉트 */}
            <Route path="/register" element={<Register />} />
            <Route
              path="/reports1"
              element={<PrivateRoute element={<Reports1 />} />}
            />
            <Route
              path="/reports2"
              element={<PrivateRoute element={<Reports2 />} />}
            />
            <Route
              path="/board"
              element={<PrivateRoute element={<Board />} />}
            />
            <Route
              path="/post/:id"
              element={<PrivateRoute element={<PostDetail />} />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
