import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './styling/Friends.css'

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      dataLoaded: false,
    };
  }

  searchData = async () => {
    try {
      const params = new URLSearchParams({ username: Cookies.get('username') });
      const response = await axios.get(`http://localhost:5002/friends?${params.toString()}`);
      this.setState({ friends: response.data || [], dataLoaded: true });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.searchData();
  }

  setUserInfo = (name) => {
    return () => Cookies.set("UserInfoName", name);
  }

  render() {
    if (!this.state.dataLoaded) {
      return <div className="loading-message">Loading...</div>

    }
    return (
        <div className="friends-container">
          <h1>Friends</h1>
          {this.state.friends.length > 0 ? (
            this.state.friends.map((stuff, index) => (
              <Link key={index} to={`/userinfo/${stuff[1]}`} className="link-no-underline" onClick={this.setUserInfo(stuff[1])}>
                <div className="friend-item">
                  <div className="friend-info">
                    <span className="friend-name">{stuff[2]} {stuff[3]}</span>
                    <span className="friend-username">{stuff[1]}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-friends-message">You currently have no friends.</div>
          )}
        </div>
      );
    }
  }
export default Friends;
