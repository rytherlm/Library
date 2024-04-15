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
  const profile = () => {
    navigate('/profile');
  };
  const recommend = () => {
    navigate('/recommend');
  };




 

  return (
    <div>
      <h1>Welcome Home, {username}</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={search}>search</button>
      <button onClick={friends}>friends</button>
      <button onClick={collections}>collections</button>
      <button onClick={profile}>profile</button>
      <button onClick={recommend}>recommend</button>
    </div>
  );
};

export default Home;