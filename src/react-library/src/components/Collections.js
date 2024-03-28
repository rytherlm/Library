import { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import {InputGroup, Input, Button, Container} from 'reactstrap';
import './styling/Collections.css';

// Users can delete books from their collection.

class Collections extends Component
{
    constructor(props){
        super(props);
        this.state = {
            currentUser: Cookies.get('username'),
            collectionName: "",
            collectionId: Cookies.get("collectionId"),
            books: [],
            book0: [],
            book0path: "",
            isUsers: false,
            bookId: 0,
            randomPath: "",
            randomBook: [],
        }
    }

    getCollectionInfo = async (e) => {
        try{      
            this.state.book0 = [];
            this.state.book0path = "";   
            const params = new URLSearchParams({collection_id: this.state.collectionId});
            console.log(params.toString());
            console.log(this.state.currentUser);
            const result = await axios.get(`http://localhost:5002/collection?${params.toString()}`);
            const result2 = await axios.get(`http://localhost:5002/stores?${params.toString()}`);//books
            console.log(result.data);
            console.log(result2.data);
            this.setState({isUsers: Cookies.get('username')===result.data[1]})
            this.setState({books: result2.data});
            this.setState({collectionName: result.data[2]})
            this.state.book0 = result2.data[0];
            this.state.book0path = '/bookinfo/' +result2.data[0][1];
            
        } catch(error){
            console.log(error);
        }
    }

    deleteBook = async(e) => {
        try{
                console.log(this.state.bookId);
                const params = new URLSearchParams({"CollectionID": this.state.collectionId, "BookID": this.state.bookId});
                const result = await axios.delete(`http://localhost:5002/stores?${params.toString()}`);
                this.setState({bookId: 0});
                this.getCollectionInfo();
                //if(result.status === 200){
                //}
        } catch(error){
            console.log(error)
        }

    }
    setBook = (id) => {
        this.state.bookId= id;
        this.deleteBook();
    }
    componentDidMount = () => {       
        this.getCollectionInfo();
    }
    getRandom = async(e) => {
        const params = new URLSearchParams({"CollectionID": this.state.collectionId});
        const result = await axios.get(`http://localhost:5002/random?${params.toString()}`);
        this.setState({randomBook: result.data});
        this.state.randomPath = '/bookinfo/' + result.data[1];
    }
    setBookInfo = (name) => {
        Cookies.set("BookInfoName", name);
    }
    render() {
        try{
        const listBooks = this.state.books.map((item, index) => {
                const linkPath = `/bookinfo/${item[1]}`;
                if(index > 0){
                return (
                    <div className="list-item">
                        <Link to={linkPath} className="link-no-underline" key={index} onClick={() => {this.setBookInfo(item[1])}}>
                            <h4>Title: {item[1]}</h4>
                        </Link>
                        <button onClick={() => {this.setBook(item[0])}}>Remove</button>
                    </div>
                );}
                else{
                    return (
                        <div className="list-item">
                            <Link to={this.state.book0path} className="link-no-underline" key={index} onClick={() => {this.setBookInfo(this.state.book0[1])}}>
                                <h4>Title: {this.state.book0[1]}</h4>
                            </Link>
                            <button onClick={() => {this.setBook(this.state.book0[0])}}>Remove</button>
                        </div>
                    );}                    
                }
        );
        if(this.state.books[0]=0){
            return (
                <div>
                    <h3>No Books in Collection.</h3>
                </div>
            )
        }
        else{
            return (
                <div>
                    <div className="random">
                        <button onClick={this.getRandom}>Get random book</button>
                        <div className="list-item">
                        <Link to={this.state.randomPath} className="link-no-underline" onClick={() => {this.setBookInfo(this.state.randomBook[1])}}>
                            <h4>Title: {this.state.randomBook[1]}</h4>
                        </Link>
                    </div>
                    </div>
                    <div className="list">
                        {listBooks}
                    </div>
                </div>
                );
        }}catch(error){
            return (
                <div>
                    <h3>No Books in Collection.</h3>
                </div>
            )
        }
    }
}
export default Collections;