import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link} from 'react-router-dom';
import './styling/SignUp.css';
import Cookies from 'js-cookie';


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !password || !firstName || !lastName) {//make sure all fields are filled in 
      console.log("Not all fields entered")
      return; 
    }
    try {
      const today = new Date().toISOString().slice(0, 10); 
      await axios.post('http://localhost:5002/bookuser', {
        Username: username,
        Password: password,
        FirstName: firstName,
        LastName: lastName,
        LastAccess: today,  
        CreationDate: today 
      });
      Cookies.set('username', username, { expires: 1 });
      navigate('/home'); 
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignUp} className="signup-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
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
        <button type="submit">Sign Up</button>
        <div className="signup-footer">
          Already have an account? <Link to="/login">Log in here</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
