import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MainPage extends Component {
  render() {
    return (
      <div>
        <h1>Main Page</h1>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    );
  }
}

export default MainPage;
