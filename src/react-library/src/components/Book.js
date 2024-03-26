// Users can rate a books (star rating) 


// Users can read a book by selecting the starting and ending pages from a particular
// book or they can read a random book from a collection. You must record every time
// a book is read by a user. You do not need to actually be able to read books, simply
// mark them as read

import {Component} from "react";
import {InputGroup, Input, Button, Container, Row, Col} from 'reactstrap';
import axios from "axios";
import { Link } from "react-router-dom";
import './styling/Search.css';
import Cookies from "js-cookie";

class Book extends Component
{
    constructor(props){
        super(props);
        this.state = {
            currentUser: "",
            bookname: "",
            info: [],
            userBookInfo: [],
            dataLoaded: false,
            averageRating: "Loading...",
            userRating: 0,
            currentRating: 0,
            progress: "Loading...",
            currentProgress: "",
            status: "Unread",
            tracked: false

        }
    }
    getBookInfo = async (e) => {
        try{
            const params = new URLSearchParams({bookname: this.state.bookname});
            const response = await axios.get(`http://localhost:5002/book?${params.toString()}`);
            console.log(response.data);    
            this.setState({ info: response.data.data})
            this.updateAverageRating()
            const paramtwo = new URLSearchParams({Username: this.state.currentUser, Bookname: this.state.bookname})
            const respontwo = await axios.get(`http://localhost:5002/rating?${paramtwo.toString()}`);
            this.setState({currentRating: respontwo.data.rating, userRating: respontwo.data.rating, dataLoaded:true})
            const paramthree = new URLSearchParams({Username: this.state.currentUser, Bookname: this.state.bookname})    
            const responthree = await axios.get(`http://localhost:5002/track?${paramthree.toString()}`);
            console.log(responthree.data)
            if (responthree.data === 404){
                this.setState({progress: 0, status: "Unread"})
            
            }
            else{
                this.setState({progress: responthree.data.progress, status: responthree.data.status, tracked: true})
        }
        }
        catch(error){
            console.log(error)
        }
    }

    updateAverageRating = async (e) => {
        try{
            const param = new URLSearchParams({Bookname: this.state.bookname});
            const response = await axios.get(`http://localhost:5002/rating?${param.toString()}`);
            console.log(response.data.average_rating)
            if(response.data.average_rating != null){
                this.setState({averageRating: response.data.average_rating})
            }
            else{this.setState({averageRating: "Not rated"})} 
        } catch(error){
            console.log(error)
        }
    }

    changeRating = async (e) => {
        this.setState({userRating: e.target.value})
    }
    
    changeProgress = (e) => {
        this.setState({currentProgress: e.target.value})
    }

    changeStatus = async (e) => {
        this.setState({status: e.target.value})
    }

    saveRatingClick = async () => {
        try{
            if(this.state.currentRating === 0){
                const paramstwo = new URLSearchParams({Bookname: this.state.bookname,
                    Username: this.state.currentUser,
                    rating: this.state.userRating,});
                const response = await axios.post(`http://localhost:5002/rating?${paramstwo.toString()}`)     
            }
            else {
                const paramstwo = new URLSearchParams({Bookname: this.state.bookname,
                    Username: this.state.currentUser,
                    rating: this.state.userRating,});
                const response = await axios.put(`http://localhost:5002/rating?${paramstwo.toString()}`)
            }
            this.updateAverageRating()

        
        } catch(error){
            console.log(error)
        }
    }

    saveTrackingClick= async () => {
        try{
            if(!this.state.tracked){
                const params = new URLSearchParams({Bookname: this.state.bookname,
                    Username: this.state.currentUser,
                    Progress: this.state.currentProgress,
                    Status: this.state.status});
                    const response = await axios.post(`http://localhost:5002/track?${params.toString()}`)     
            }else{
                const params = new URLSearchParams({Bookname: this.state.bookname,
                    Username: this.state.currentUser,
                    Progress: this.state.currentProgress,
                    Status: this.state.status});
                    const response = await axios.put(`http://localhost:5002/track?${params.toString()}`)
            }
            this.updateAverageRating()
        }catch(error){
            console.log(error)
        }
    }


    updateTracking = async (e) => {
        try{
            const param = new URLSearchParams({Username: this.state.currentUser, Bookname: this.state.bookname});    
            const response = await axios.get(`http://localhost:5002/track?${param.toString()}`);
            console.log(response.data.average_rating)
            this.setState({progress: response.data.progress, status: response.data.status})}
        catch(error){
            console.log(error)
        }
    }

    componentDidMount = () => {
        this.setState({ 
            bookname: Cookies.get('UserInfoName'),
            currentUser: Cookies.get('username')
        }, () => {
            this.getBookInfo();
        });
    }

    
    render() {
        let saveButtonRating;
        saveButtonRating = (
            <Button type="submit" onClick={() => this.saveRatingClick()}>Save rating</Button>
        );
        let saveButtonTracking;
            saveButtonTracking = (
              <Button type="submit" onClick={() => this.saveTrackingClick()}>Save status</Button>
        );
        if (!this.state.dataLoaded || this.state.progress==="Loading...") {
          return (
            <div className="book">
                <div className="loading-message">Loading...</div>
            </div>
          );
        }
    
        return (
          <div className="book">
            <h3>Title: {this.state.info[0][1]}</h3>
            <h4>Author: {this.state.info[0][5]} {this.state.info[0][6]}</h4>
            <h4>Publisher: {this.state.info[0][4]}</h4>
            <h4>Length: {this.state.info[0][3]} pages</h4>
            <h4>Genre: {this.state.info[0][2]}</h4>
            <h4>Average Rating: {this.state.averageRating}</h4>
            <InputGroup><h4>Your rating: 
                    <select value ={this.state.userRating} onChange={this.changeRating}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    </select>
                    </h4>
            </InputGroup>
            {saveButtonRating}
            <h3>Tracking</h3>
            <h4>Current progress page: {this.state.progress}</h4>
            <h4>New progress page: <InputGroup>
            <Input onChange={this.changeProgress}/>
            </InputGroup></h4> 
            <InputGroup><h4>Status:
                    <select value ={this.state.status} onChange={this.changeStatus}>
                    <option value="Unread">Unread</option>
                    <option value="Reading">Reading</option>
                    <option value="Read">Read</option>
                    </select>
                    </h4>
            </InputGroup>
            {saveButtonTracking}
            </div>
        );

        
      }




}    

export default Book;