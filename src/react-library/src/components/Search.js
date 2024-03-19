// Users will be able to search for books by name, release date, authors, publisher, or
// genre. The resulting list of books must show the book’s name, the authors, the pub-
// lisher, the length, audience and the ratings. The list must be sorted alphabetically
// (ascending) by book’s name and release date. Users can sort the resulting list: book
// name, publisher, genre, and released year (ascending and descending).


// Users can follow another user. Users can search for new users to follow by email
import {Component} from "react";
import {InputGroup, InputGroupText, Input, Button} from 'reactstrap';
import axios from "axios";

class Search extends Component
{
    constructor(props){
        super(props);
        this.state={
            searchQuery: "",
            searchResult: [],
            searchType: "user",
        }
    }

    searchData = async (e) => {
        e.preventDefault();
        try{
            if(this.state.searchType === "user"){
                const params = new URLSearchParams({ Username: this.state.searchQuery });
                const response = await axios.get(`http://localhost:5002/bookuser?${params.toString()}`);
                if(response.status === 200){
                    this.setState({searchResult: response.data.data});
                }
                else{
                    this.setState({searchResult: ""});
                }
            }
            else{
                const params = new URLSearchParams({ bookname: this.state.searchQuery });
                const response = await axios.get(`http://localhost:5002/book?${params.toString()}`);
                if(response.status === 200){
                    this.setState({searchResult: response.data.data});
                }
                else{
                    this.setState({searchResult: ""});
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
    }

    changeSearch = (e) => {
        this.setState({searchQuery:e.target.value})
    }

    render()
    {
        return(
            <div>
                <form onSubmit = {this.searchData}>
                    <h1>Search</h1>
                    <InputGroup>
                        <Input onChange = {this.changeSearch}/>
                    </InputGroup>
                    <InputGroup>
                        <select value={this.state.searchType} onChange={this.changeSearchType}>
                            <option value="user">User</option>
                            <option value="book">Book</option>
                        </select>
                    </InputGroup>
                    <Button type = "submit">Search</Button>
                </form>
                {this.state.searchResult.map((stuff) =>
                    <h3>{stuff[1]}</h3>
                )}
            </div>
        )
    }
}

export default Search;