// • The application provides an user profile functionality that displays the following infor-
// mation:
// – The number of collections the user has
// – The number of users followed by this user
// – The number of users this user is following
// – Their top 10 books by highest rating of user books
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './styling/Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    collections: 0,
    following: 0,
    followers: 0,
    topBooks: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      const username = Cookies.get('username');
      if (!username) {
        console.error('Username is missing');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5002/profile`, {
          params: { Username: username }
        });
        if (response.data) {
          setProfileData({
            collections: response.data.collections,
            following: response.data.following,
            followers: response.data.followers,
            topBooks: response.data.top_books || [] 
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (isLoading) {
    return <div className="loading-message">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-info">Number of Collections: {profileData.collections}</div>
      <div className="profile-info">Following: {profileData.following}</div>
      <div className="profile-info">Followers: {profileData.followers}</div>
      <h2 className="books-title">Top 10 Books</h2>
      <ul className="books-list">
        {profileData.topBooks.length > 0 ? profileData.topBooks.map((book, index) => (
          <li key={index} className="book-item">
            <Link to={`/bookinfo/${book.title}`} className="book-link">
              {book.title} - Average Rating: {book.average_rating}
            </Link>
          </li>
        )) : <div className="no-books">No books rated.</div>}
      </ul>
    </div>
  );
};

export default Profile;
