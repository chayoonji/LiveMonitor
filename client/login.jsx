import React, { useState, useEffect } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.name);
      setIsLoggedIn(true);
      onLogin(user);
    }
  }, [onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      const { name } = response.data;
      const user = { email, name };
      setUsername(name);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);

      alert("Logged in successfully");
    } catch (error) {
      alert("Error logging in");
    }
  };

  const handleLogout = () => {
    setUsername("");
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    onLogin(null);
  };

  return (
    <div className="login-wrapper">
      {isLoggedIn ? (
        <div>
          <h2>Welcome, {username}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit} id="login-form">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
      )}
    </div>
  );
};

export default Login;