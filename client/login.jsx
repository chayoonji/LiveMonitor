import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login, setIsAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/login', {
        userId,
        password,
      });

      if (response.data.success) {
        login(userId);
        setIsAdmin(response.data.isAdmin); // isAdmin 상태 업데이트
        alert('Logged in successfully');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div className="login-wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} id="login-form">
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
