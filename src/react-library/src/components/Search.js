// Users will be able to search for books by name, release date, authors, publisher, or
// genre. The resulting list of books must show the book’s name, the authors, the pub-
// lisher, the length, audience and the ratings. The list must be sorted alphabetically
// (ascending) by book’s name and release date. Users can sort the resulting list: book
// name, publisher, genre, and released year (ascending and descending).


// Users can follow another user. Users can search for new users to follow by email
import {Component} from "react";
import {InputGroup, Input, Button, Container} from 'reactstrap';
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
            searched: false,
            searching: false,
            sort: "title",
            ascending: true,
        }
    }

    searchData = async (e) => {
        e.preventDefault();
        try{
            this.setState({searched: false, searching: true, searchResult: []})
            if(this.state.searchType === "user"){
                const params = new URLSearchParams();
                params.append(this.state.attributeType, this.state.searchQuery);                
                const response = await axios.get(`http://localhost:5002/usersearch?${params.toString()}`);
                if(response.data === null || response.data.length === 0){
                    this.setState({searchResult: [], searching: false})
                    alert("No result.")
                }
                else{
                    this.setState({searchResult: response.data, searched:true, searching: false});
                }
            }
            else{
                this.setState({searched: false})
                const params = new URLSearchParams();
                params.append(this.state.attributeType, this.state.searchQuery);
                const response = await axios.get(`http://localhost:5002/booksearch?${params.toString()}`);
                if(response.data === null || response.data.length === 0){
                    this.setState({searchResult: [], searching:false})
                    alert("No result.")
                }
                else{
                    this.setState({searchResult: response.data, searched:true, searching: false});
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
        this.setState({searchResult: [], searched: false})
    }

    changeSearch = (e) => {
        this.setState({searchQuery:e.target.value})
    }

    changeAttributeType = (e) => {
        this.setState({attributeType: e.target.value})
    }

    changeSort = (e) => {
        this.setState({ 
            sort: e.target.value    
        }, () => {
            this.sortResult()
        });
    }

    changeOrder = (e) => {
        console.log(this.state.searchResult)
        if(this.state.ascending){
            this.setState({ascending: false
            }, () => {
                this.sortResult()
            });
        }
        else{
            this.setState({ascending: true
            }, () => {
                this.sortResult()
            });
        }
    }

    sortResult = () => {
        console.log(this.state.ascending)
        console.log(this.state.sort)
        if(this.state.sort === "releasedate"){
            const sortedByYear = [...this.state.searchResult].sort((a, b) => {
                if(this.state.ascending === true)
                    return a[4] - b[4];
                else{
                    return b[4] - a[4];
                }
            });
            this.setState({searchResult: sortedByYear})
        }
        else if(this.state.sort === "title"){
            const sortedByTitle = [...this.state.searchResult].sort((a, b) => {
                if(this.state.ascending === true)
                    return a[1].localeCompare(b[1]);
                else{
                    return b[1].localeCompare(a[1]);
                }
            });
            this.setState({searchResult: sortedByTitle})
        }
        else if(this.state.sort === "publisher"){
            const sortedByAuthorPublisher = [...this.state.searchResult].sort((a, b) => {
                if(this.state.ascending === true)
                    return a[5].localeCompare(b[5]);
                else{
                    return b[5].localeCompare(a[5]);
                }
            });
            this.setState({searchResult: sortedByAuthorPublisher})
        }
        else if(this.state.sort === "genre"){
            const sortedByGenre = [...this.state.searchResult].sort((a, b) => {
                console.log(a[6])
                if(this.state.ascending === true)
                    return a[6].localeCompare(b[6]);
                else{
                    return b[6].localeCompare(a[6]);
                }
            });
            this.setState({searchResult: sortedByGenre})
        }
    }

    setInfo = (name) => {
        if(this.state.searchType === "user"){
            Cookies.set("UserInfoName", name)
        }
        else {
            Cookies.set("BookInfoName", name)
        }
    }

    render() {
        let sort;
        let loading;
        const attributeOptions = this.state.searchType === "user" ? (
            <>
                <option value="username">Username</option>
                <option value="email">Email</option>
            </>
        ) : (
            <>
                <option value="title">Title</option>
                <option value="releasedate">Release Date</option>
                <option value="author">Author</option>
                <option value="publisher">Publisher</option>
                <option value="genre">Genre</option>
            </>
        );
        if(this.state.searching){
            loading = (
                <h2>Loading...</h2>
            )
        }
        if(this.state.searchType === "book" && this.state.searched){
            sort = (
                <div style = {{marginTop: '10px'}}>
                    <label htmlFor="sort">Sort:</label>
                    <select onChange = {this.changeSort}>
                        <option value = "title">Title</option>
                        <option value = "publisher">Publisher</option>
                        <option value = "genre">Genre</option>
                        <option value = "releasedate">Release Date</option>
                    </select>
                    <select onChange = {this.changeOrder}>
                        <option value = "ascending">Ascending</option>
                        <option value = "descending">Descending</option>
                    </select>
                </div>
            )
        }
    
            const searchResults = this.state.searchResult.map((item, index) => {
            const isCurrentUser = item[1] === Cookies.get('username');
            const ratingValues = item[7];
            const ratingCount = item[8];
            const contributors = item[5];
            const contributor = contributors.split(',');
            const author = contributor[0].trim();
            const publisher = contributor.slice(1).join(',').trim();
            const average = ratingCount != 0 ? ratingValues/ratingCount : "No data";
            const linkPath = this.state.searchType === "user" ? `/userinfo/${item[1]}` : `/bookinfo/${item[1]}`;
            return (
                !isCurrentUser && (
                    <Link to={linkPath} className="link-no-underline" key={index} onClick={() => this.setInfo(item[1])}>
                        <div className="search-result-item">
                            {this.state.searchType === "user" ? (
                                <>
                                    <h3>Username: {item[1]}</h3>
                                    <h4>Name: {item[2]} {item[3]}</h4>
                                    <h4>Email: {item[4]}</h4>
                                </>
                            ) : (
                                <>
                                    <h3>Title: {item[1]}</h3>
                                    <h4>Author: {author} </h4>
                                    <h4>Publisher: {publisher}</h4>
                                    <h4>Release Date: {item[4]}</h4>
                                    <h4>Audience: {item[3]} </h4>
                                    <h4>Length: {item[2]} pages</h4>
                                    <h4>Genres: {item[6]}</h4>
                                    <h4>Rating: {average}</h4>
                                </>
                            )}
                        </div>
                    </Link>
                )
            );
        });
    
        return (
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
                        <select onChange={this.changeAttributeType} style={{ marginLeft: '10px' }}>
                            {attributeOptions}
                        </select>
                        {sort}
                    </InputGroup>
                    <Button className="search-button" type="submit">Search</Button>
                </form>
                <Container className="search-result">{searchResults}</Container>
                {loading}
            </div>
        );
    }
    
}    

export default Search;