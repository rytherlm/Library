import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link} from 'react-router-dom';
import './styling/SignUp.css';
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs';


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');



  

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !password || !firstName || !lastName ||!email){
      alert("Please fill in all fields.");
      return; 
    }

    try {
      const today = new Date().toISOString().slice(0, 10);
      const hashedPassword = bcrypt.hashSync(password, 10); 
      const result = await axios.post('http://localhost:5002/bookuser', {
        Username: username,
        Password: hashedPassword,
        Email: email,
        FirstName: firstName,
        LastName: lastName,
        LastAccess: today,  
        CreationDate: today,
        
      });
      console.log(result.status)
      if (result.status === 201){
        Cookies.set('username', username, { expires: 1 });
        navigate('/home');
      }
       
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
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
