import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const username = Cookies.get('username');
  const handleLogout = () => {
    Cookies.remove('username');
    navigate('/login');
  };

  const search = () => {
    navigate('/search');
  };

  const friends = () => {
    navigate('/friends');
  };

  const collections = () => {
    navigate('/allcollections');
  };

  

  return (
    <div>
      <h1>Welcome Home, {username}</h1>
      <button onClick={handleLogout}>Logout</button>

      <button onClick={search}>search</button>

      <button onClick={friends}>friends</button>

      <button onClick={collections}>collections</button>
    </div>
  );
};

export default Home;