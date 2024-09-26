import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Header from './Header';
import Home from './Home';
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
import Diagnosis from './Diagnosis';
import Routine from './routine';
import Solutions from './SolutionPage';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = React.useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/home"
            element={
              <>
                <Header OpenSidebar={OpenSidebar} />
                <Home /> {/* 첫 번째 화면 */}
              </>
            }
          />

          {/* 나머지 경로는 사이드바만 보이고 헤더는 없음 */}
          <Route
            path="*"
            element={
              <div className="grid-container">
                <Sidebar
                  openSidebarToggle={openSidebarToggle}
                  OpenSidebar={OpenSidebar}
                />
                <Routes>
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/routine" element={<Routine />} />
                  <Route path="/login" element={<LoginComponent />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/" element={<Navigate to="/guide" />} />
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
                  <Route
                    path="/diagnosis"
                    element={<PrivateRoute element={<Diagnosis />} />}
                  />
                  <Route
                    path="/solutions"
                    element={<PrivateRoute element={<Solutions />} />}
                  />
                </Routes>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
