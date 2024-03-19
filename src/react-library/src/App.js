import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LoginForm';
import SignUp from './components/SignupForm';
import Home from './components/Home';
import Search from './components/Search';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="search" element={<Search/>} />
      </Routes>
    </Router>
  );
};

export default App;
