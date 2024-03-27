// Users can rate a books (star rating) 


// Users can read a book by selecting the starting and ending pages from a particular
// book or they can read a random book from a collection. You must record every time
// a book is read by a user. You do not need to actually be able to read books, simply
// mark them as read

import {Component} from "react";
import {InputGroup, Input, Button, Container, Row, Col} from 'reactstrap';
import axios from "axios";
// import './styling/Search.css';
import Cookies from "js-cookie";
import './styling/Book.css'


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
            tracked: false,
            sections: [],
            starttime: '',
            endtime: '',
            startpage: '',
            endpage: '',
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
            this.setState({currentRating: respontwo.data.rating, userRating: respontwo.data.rating})   
            const responthree = await axios.get(`http://localhost:5002/track?${paramtwo.toString()}`);
            console.log(responthree.data)
            if (responthree.data === 404){
                this.setState({progress: 0, status: "Unread"})
            
            }
            else{
                this.setState({progress: responthree.data.progress, status: responthree.data.status, tracked: true})
            }
            const responsefour = await axios.get (`http://localhost:5002/section?${paramtwo.toString()}`);
            this.setState({sections: responsefour.data, dataLoaded:true})
            console.log(this.state.sections)
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
    changeStartTime= async (e) => {
        console.log(e.target.value)
        this.setState({starttime: e.target.value})
    }
    changeEndTime = async(e) =>{
        console.log(e.target.value)
        this.setState({endtime: e.target.value})
    }
    changeStartPage = async (e) => {
        console.log(e.target.value)
        this.setState({startpage: e.target.value})
    }
    changeEndPage = async(e) =>{
        console.log(e.target.value)
        this.setState({endpage: e.target.value})
    }
    saveRatingClick = async () => {
        try{
            if(this.state.currentRating === 0){
                const paramstwo = new URLSearchParams({Bookname: this.state.bookname,
                    Username: this.state.currentUser,
                    rating: this.state.userRating,});
                await axios.post(`http://localhost:5002/rating?${paramstwo.toString()}`)     
            }
            else {
                const paramstwo = new URLSearchParams({Bookname: this.state.bookname,
                    Username: this.state.currentUser,
                    rating: this.state.userRating,});
                await axios.put(`http://localhost:5002/rating?${paramstwo.toString()}`)
            }
            this.updateAverageRating()

        
        } catch(error){
            console.log(error)
        }
    }

    saveTrackingClick= async () => {
        try{
            if (this.state.currentProgress === ""){
                alert("Please fill in a page number before submiting");
                return;
            }
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
    
    createSectionClick = async(e) => {
        e.preventDefault();

        if (! this.state.startpage || ! this.state.endpage || ! this.state.starttime|| ! this.state.endtime){
            alert("Please fill in all fields for section"); 
        }
        else {
            try {
                const [hours,minutes]= this.state.starttime.split(':').map(num => parseFloat(num,10));
                const start = new Date()
                start.setHours(hours)
                start.setMinutes(minutes)
                const [hours2,minutes2]= this.state.starttime.split(':').map(num => parseFloat(num,10));
                const end = new Date()
                start.setHours(hours2)
                start.setMinutes(minutes2)
                const timestart = start.toTimeString().slice(0, 8)
                const timeend= end.toTimeString().slice(0, 8)
                console.log(timestart)
                const params = new URLSearchParams({Username: this.state.currentUser,
                    Bookname: this.state.bookname,
                    StartTime: timestart,
                    EndTime: timeend,
                    StartPage: this.state.startpage,
                    EndPage: this.state.endpage})
                console.log(params)    
                const result = await axios.post(`http://localhost:5002/section?${params.toString()}`);
                console.log(result.status)
                const paramtwo = new URLSearchParams({Username: this.state.currentUser, Bookname: this.state.bookname})
                const responsefour = await axios.get(`http://localhost:5002/section?${paramtwo.toString()}`);
                this.setState({sections: responsefour.data.data})
            } catch (error) {
                alert("Failed to create new section")
                console.log(error)
            }
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
        let saveButtonRating = (
            <Button className="button" type="submit" onClick={this.saveRatingClick}>Save Rating</Button>
        );
        let saveButtonTracking = (
            <Button className="button" type="submit" onClick={this.saveTrackingClick}>Save Tracking</Button>
        );
    
        
        let createSection;
            createSection = (
                <Button className="button" type="submit" onClick={() => this.createSectionClick}>Create Section</Button>
            );
        if (!this.state.dataLoaded || this.state.progress === "Loading...") {
            return (
                <div className="book-container">
                    <div className="loading-message">Loading...</div>
                </div>
            );
        }

        const sectionList = this.state.sections.map((item, index) => (
            <div className="section-item" key={index}>
                <h4>Start time: {item[0]}</h4>
                <h4>End time: {item[1]}</h4>
                <h4>Start page: {item[2]} to End page: {item[3]}</h4>
            </div>
        ));

        return (
            <div className="book-container">
                <div className="book-info">
                    <h3>Title: {this.state.info[0][1]}</h3>
                    <h4>Author: {this.state.info[0][5]} {this.state.info[0][6]}</h4>
                    <h4>Publisher: {this.state.info[0][4]}</h4>
                    <h4>Length: {this.state.info[0][3]} pages</h4>
                    <h4>Genre: {this.state.info[0][2]}</h4>
                    <h4>Average Rating: {parseFloat(this.state.averageRating).toFixed(1)}</h4>
                    <InputGroup className="input-group">
                        <select className="input-group" value={this.state.userRating} onChange={this.changeRating}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </InputGroup>
                    {saveButtonRating}
                </div>
                <div className="tracking-info">
                    <h3>Tracking</h3>
                    <h4>Current progress page: {this.state.progress}</h4>
                    <InputGroup className="input-group">
                        <Input onChange={this.changeProgress} />
                    </InputGroup>
                    <h4>Status:
                        <select className="input-group" value={this.state.status} onChange={this.changeStatus}>
                            <option value="Unread">Unread</option>
                            <option value="Reading">Reading</option>
                            <option value="Read">Read</option>
                        </select>
                    </h4>
                    {saveButtonTracking}
                </div>
                <div className="section-creation-form">
                    <form onSubmit={this.createSectionClick}>
                        <InputGroup className="input-group">
                            <Input onChange={this.changeStartTime} placeholder="Start Time" />
                        </InputGroup>
                        <InputGroup className="input-group">
                            <Input onChange={this.changeEndTime} placeholder="End Time" />
                        </InputGroup>
                        <InputGroup className="input-group">
                            <Input onChange={this.changeStartPage} placeholder="Start Page" />
                        </InputGroup>
                        <InputGroup className="input-group">
                            <Input onChange={this.changeEndPage} placeholder="End Page" />
                        </InputGroup>
                        {createSection}
                    </form>
                </div>
            </div>
        );
    }




}    

export default Book;
