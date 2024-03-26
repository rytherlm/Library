import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LoginForm';
import SignUp from './components/SignupForm';
import Home from './components/Home';
import Search from './components/Search';
import UserInfo from './components/UserInfo';
import Friends from './components/Friends';
import Book from './components/Book';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="search" element={<Search/>} />
        <Route path="/userinfo/:username" element={<UserInfo />} />
        <Route path="/friends" element={<Friends/>}/>
        <Route path="/bookinfo/:bookName" element={<Book />}/>
      </Routes>
    </Router>
  );
};

export default App;
