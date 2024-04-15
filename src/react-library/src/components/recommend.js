
// • The application must provide a book recommendation system with the following op-
// tions:
// – The top 20 most popular books in the last 90 days (rolling)
// – The top 20 most popular books among my followers
// – The top 5 new releases of the month (calendar month)
// – For you: Recommend books to read to based on your read history (e.g. genre,
// author, rating) and the read history of similar users
import {Component} from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import './styling/Search.css';

class Recommend extends Component {
    constructor(props){
        super(props);
        this.state={
            followerBooks: [],
            topBooks:[],
            topFive:[],
            forYou:[],
            dataLoaded: false,
        };
    }

    searchData = async () => {
        try {
            const params = new URLSearchParams({Username: Cookies.get('username')});
            const response = await axios.get(`http://localhost:5002/followerbook?${params.toString()}`);
            this.setState({followerBooks: response.data});

            const response2 = await axios.get(`http://localhost:5002/topbooks`);
            this.setState({topBooks: response2.data});

            const response3 = await axios.get(`http://localhost:5002/topfive`);
            this.setState({topFive: response3.data});

            const response4 = await axios.get(`http://localhost:5002/foryou?${params.toString()}`);
            console.log(response4);
            this.setState({forYou: response4.data, dataLoaded: true});
            console.log("Top 5: ", response3.data);
            console.log("For You Data: ", response4.data);
        } catch(error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.searchData();
    }

    handleBookClick = (bookName) => {
        Cookies.set("BookInfoName", bookName);
    }

    render() {    
        if (!this.state.dataLoaded) {
            return (
              <div className="user">
                  <div className="loading-message">Loading...</div>
              </div>
            );
        }
        return (
            <div>
                <h2>Top 20 Most Popular Books In The Last 90 days</h2>
                {this.state.topBooks.map((stuff, index) => (
                    <ul className="books-list" key={index}>
                        <li key={index} className="book-item">
                            <Link to={`/bookinfo/${stuff[0]}`} onClick={() => this.handleBookClick(stuff[0])} className="book-link">
                                {stuff[0]}
                            </Link>
                        </li>
                    </ul>
                ))}
                <h2>Top 5 New Releases Of The Month</h2>
                {this.state.topFive.map((stuff, index) => (
                    <ul className="books-list" key={index}>
                        <li key={index} className="book-item">
                            <Link to={`/bookinfo/${stuff[0]}`} onClick={() => this.handleBookClick(stuff[0])} className="book-link">
                                {stuff[0]}
                            </Link>
                        </li>
                    </ul>
                ))}
                <h2>Top 20 Most Popular Books Among My Followers</h2>
                {this.state.followerBooks.map((stuff, index) => (
                    <ul className="books-list" key={index}>
                        <li key={index} className="book-item">
                            <Link to={`/bookinfo/${stuff[0]}`} onClick={() => this.handleBookClick(stuff[0])} className="book-link">
                                {stuff[0]}
                            </Link>
                        </li>
                    </ul>
                ))}
                <h2>For You</h2>
                {this.state.forYou.map((stuff, index) => (
                    <ul className="books-list" key={index}>
                        <li key={index} className="book-item">
                            <Link to={`/bookinfo/${stuff[0]}`} onClick={() => this.handleBookClick(stuff[1])} className="book-link">
                                {stuff[1]}
                            </Link>
                        </li>
                    </ul>
                ))}
            </div>
        );
    }
}

export default Recommend;
