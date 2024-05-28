import React, { useState } from 'react';

const Login = () => {
  return (
    <div class="login-wrapper">
      <h2>Login</h2>
      <form method="post" action="서버의url" id="login-form">
        <input type="text" name="userName" placeholder="Email" />
        <input type="password" name="userPassword" placeholder="Password" />
        <label for="remember-check">
          <input type="checkbox" id="remember-check" />
          아이디 저장하기
        </label>
        <div className="button-container">
          <input type="submit" value="Login" />
          <input type="submit" value="SignUp" />
        </div>
      </form>
    </div>
  );
};

export default Login;
