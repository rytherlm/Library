// Users will be able to search for books by name, release date, authors, publisher, or
// genre. The resulting list of books must show the book’s name, the authors, the pub-
// lisher, the length, audience and the ratings. The list must be sorted alphabetically
// (ascending) by book’s name and release date. Users can sort the resulting list: book
// name, publisher, genre, and released year (ascending and descending).


// Users can follow another user. Users can search for new users to follow by email
import {Component} from "react";
import {InputGroup, Input, Button, Container, Row, Col} from 'reactstrap';
import axios from "axios";
import { Link } from "react-router-dom";
import './styling/Search.css';
import Cookies from "js-cookie";

class Search extends Component
{
    constructor(props){
        super(props);
        this.state={
            searchQuery: "",
            searchResult: [],
            searchType: "user",
            attributeType: "username",
        }
    }

    searchData = async (e) => {
        e.preventDefault();
        try{
            if(this.state.searchType === "user"){
                const params = new URLSearchParams();
                params.append(this.state.attributeType, this.state.searchQuery);                
                const response = await axios.get(`http://localhost:5002/usersearch?${params.toString()}`);
                if(response.data === null || response.data.length === 0){
                    this.setState({searchResult: []})
                    alert("No result.")
                }
                else{
                    this.setState({searchResult: response.data});
                }
            }
            else{
                const params = new URLSearchParams();
                params.append(this.state.attributeType, this.state.searchQuery);
                const response = await axios.get(`http://localhost:5002/booksearch?${params.toString()}`);
                if(response.data === null || response.data.length === 0){
                    this.setState({searchResult: []})
                    alert("No result.")
                }
                else{
                    this.setState({searchResult: response.data});
                    console.log(this.state.searchResult)
                }
            }
        } catch(error){
            if(error.response && error.response.status === 401){
                alert('No Results')
            }
        }
    }

    changeSearchType = (e) => {
        this.setState({searchType: e.target.value})
        if(e.target.value === "user"){
            this.setState({attributeType: "username"})
        }
        else{
            this.setState({attributeType: "title"})
        }
        this.setState({searchResult: []})
    }

    changeSearch = (e) => {
        this.setState({searchQuery:e.target.value})
    }

    changeAttributeType = (e) => {
        this.setState({attributeType: e.target.value})
    }

    render()
    {
        let attribute;
        if(this.state.searchType === "user"){
            attribute = (
                <select onChange = {this.changeAttributeType}>
                    <option value = "username">Username</option>
                    <option value = "email">Email</option>
                </select>
            )
        }
        else{
            attribute = (
                <select onChange = {this.changeAttributeType}>
                    <option value = "title">Title</option>
                    <option value = "releasedate">Release Date</option>
                    <option value = "author">Author</option>
                    <option value = "publisher">Publisher</option>
                    <option value = "genre">Genre</option>
                </select>
            )
        }
        return(
            <div className="search-container">
            <form className="search-form" onSubmit={this.searchData}>
              <h1>Search</h1>
              <InputGroup className="search-input">
                <Input onChange={this.changeSearch} />
              </InputGroup>
              <InputGroup className="search-select">
                <select value={this.state.searchType} onChange={this.changeSearchType}>
                  <option value="user">User</option>
                  <option value="book">Book</option>
                </select>
                <div style={{ marginLeft: '10px' }}>
                    {attribute}
                </div>
              </InputGroup>
              <Button className="search-button" type="submit">Search</Button>
            </form>
            <div className="search-result">
                <Container>
                {this.state.searchResult.map((stuff, index) => {
                    const currentUser = Cookies.get('username');
                    if (this.state.searchType === "user"){
                        if (stuff[1] !== currentUser) {
                            return (
                                <Row key={index}>
                                    <Col className="mb-4">
                                        <Link to={`/userinfo/${stuff[1]}`} className = "link-no-underline">
                                            <div className="search-result-item">
                                                <h3>{stuff[1]}</h3>
                                            </div>
                                        </Link>
                                        <h4>{stuff[2]} {stuff[3]}</h4>
                                    </Col>
                                </Row>
                            );
                        } else {
                            return null; 
                        }
                    }
                    else{
                        return (
                            <Row key={index}>
                                <Col className="mb-4">
                                    <Link to={`/userinfo/${stuff[1]}`} className = "link-no-underline">
                                        <div className="search-result-item">
                                            <h3>{stuff[1]}</h3>
                                        </div>
                                    </Link>
                                    <h4>{stuff[5]} {stuff[6]}</h4>
                                    <h4>- {stuff[4]}</h4>
                                </Col>
                            </Row>
                        );
                    }
                })}
                </Container>
              
            </div>
          </div>
          
        )
    }
}

export default Search;