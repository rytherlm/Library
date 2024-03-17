import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import './styling/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
      e.preventDefault();

      if (!username || !password) {
        alert('Both username and password are required.');
        return; 
    }
      try {
          const params = new URLSearchParams({ Username: username, Password: password });
          const response = await axios.get(`http://localhost:5002/bookuser?${params.toString()}`);
          
          if (response.status === 200) {
              Cookies.set('username', username, { expires: 1 });
              navigate('/home');
          }
      } catch (error) {
          if (error.response && error.response.status === 401) {
              alert('Incorrect username or password.');
          }
      }
  };

  return (
      <div className="login-container">
          <form onSubmit={handleLogin} className="login-form">
              <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Sign In</button>
              <div className="login-footer">
                  Don't have an account? <Link to="/signup">Sign up here</Link>
              </div>
          </form>
      </div>
  );
};

export default Login;
