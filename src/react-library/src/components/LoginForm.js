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
        try {
            const response = await axios.get('http://localhost:5002/bookuser');
            const users = response.data;
            const userExists = users.some(user => user.Username === username && user.Password === password);
            
            if (userExists) {
                Cookies.set('username', username, { expires: 1 });
                navigate('/home');
            } else {
                alert('Incorrect username or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
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
