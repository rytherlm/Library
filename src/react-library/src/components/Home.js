import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('username');
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome Home</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;