// Users can rate a books (star rating) 


// Users can read a book by selecting the starting and ending pages from a particular
// book or they can read a random book from a collection. You must record every time
// a book is read by a user. You do not need to actually be able to read books, simply
// mark them as read

import {Component} from "react";
import {InputGroup, Input, Button, InputGroupText} from 'reactstrap';
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
            bookid: 0,
            collections: [],
            collection: 0,
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
            startdate: '',
            starttime: '',
            enddate: '',
            endtime: '',
            startpage: '',
            endpage: '',
        }
    }
    getBookInfo = async (e) => {
        try{
            const params = new URLSearchParams({title: this.state.bookname});
            const response = await axios.get(`http://localhost:5002/booksearch?${params.toString()}`);
            this.state.bookid = response.data[0][0];
            this.setState({ info: response.data})
            this.updateAverageRating()
            const paramtwo = new URLSearchParams({Username: this.state.currentUser, Bookname: this.state.bookname})
            const respontwo = await axios.get(`http://localhost:5002/rating?${paramtwo.toString()}`);
            this.setState({currentRating: respontwo.data.rating, userRating: respontwo.data.rating})   
            const responthree = await axios.get(`http://localhost:5002/track?${paramtwo.toString()}`);
            if (responthree.data === 404){
                this.setState({progress: 0, status: "Unread"})
            
            }
            else{
                this.setState({progress: responthree.data.progress, status: responthree.data.status, tracked: true})
            }
            const responsefour = await axios.get (`http://localhost:5002/section?${paramtwo.toString()}`);
            this.setState({sections: responsefour.data, dataLoaded:true})
        }
        catch(error){
            console.log(error)
        }
    }

    updateAverageRating = async (e) => {
        try{
            const param = new URLSearchParams({Bookname: this.state.bookname});
            const response = await axios.get(`http://localhost:5002/rating?${param.toString()}`);
            if(response.data.average_rating != null){
                this.setState({averageRating: response.data.average_rating})
            }
            else{this.setState({averageRating: "Not rated"})} 
        } catch(error){
            console.log(error)
        }
    }

    changeRating = (e) => {
        this.setState({userRating: e.target.value})
    }
    
    changeProgress = (e) => {
        this.setState({currentProgress: e.target.value})
    }

    changeStatus = (e) => {
        this.setState({status: e.target.value})
    }
    changeStartDate = (e) => {
        this.setState({startdate: e.target.value})
        console.log(this.state.startdate)
    }
    changeStartTime = (e) => {
        this.setState({starttime: e.target.value})
    }
    changeEndDate = (e) => {
        this.setState({enddate: e.target.value})
    }
    changeEndTime = (e) =>{
        this.setState({endtime: e.target.value})
    }
    changeStartPage = (e) => {
        this.setState({startpage: e.target.value})
    }
    changeEndPage = (e) =>{
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

        if (! this.state.startpage || ! this.state.endpage || ! this.state.starttime|| ! this.state.endtime || !this.state.startdate || !this.state.enddate){
            alert("Please fill in all fields for section"); 
        }
        else if(this.state.startpage < 0 || this.state.endpage < 0){
            alert("Pages cannot be negative")
        }
        else if(parseInt(this.state.startpage, 10) > parseInt(this.state.endpage, 10)){
            alert("Start Page cannot be greater than End Page")
        }
        else if(this.state.startdate > this.state.enddate){
            alert("Start Date cannot be later than End Date")
        }
        else if(this.state.startdate === this.state.enddate && this.state.starttime > this.state.endtime){
            alert("Start Time cannot be later than End Time")
        }
        else {
            try {
                const start =`${this.state.startdate} ${this.state.starttime}`
                const end = `${this.state.enddate} ${this.state.endtime}`
                const result = await axios.post('http://localhost:5002/section', {
                    Username: this.state.currentUser,
                    Bookname: this.state.bookname,
                    StartTime: start,
                    EndTime: end,
                    StartPage: this.state.startpage,
                    EndPage: this.state.endpage
                });
                if(result.status === 400){
                    alert(result.data.message)
                }
                const paramtwo = new URLSearchParams({Username: this.state.currentUser, Bookname: this.state.bookname})
                const responsefour = await axios.get(`http://localhost:5002/section?${paramtwo.toString()}`);
                this.setState({sections: responsefour.data})
            } catch (error) {
                if(error.response.status === 400){
                    alert("End Page exceeds the book's length")
                }
            }
        }
    }
    

    updateTracking = async (e) => {
        try{
            const param = new URLSearchParams({Username: this.state.currentUser, Bookname: this.state.bookname});    
            const response = await axios.get(`http://localhost:5002/track?${param.toString()}`);
            this.setState({progress: response.data.progress, status: response.data.status})}
        catch(error){
            console.log(error)
        }
    }

    componentDidMount = () => {
        this.setState({ 
            bookname: Cookies.get('BookInfoName'),
            currentUser: Cookies.get('username')
        }, () => {
            this.getBookInfo();
            this.getCollections();
        });
    }
    addBook = async(e) =>{
        var element = document.querySelector('#addcol');
        this.state.collection = element.value;
        /*const params = new URLSearchParams();
        params.append('CollectionID', this.state.collection);
        params.append('BookID', this.state.bookid);
        console.log(params.toString());
        const result = await axios.post(`http://localhost:5002/stores?${params.toString()}`);*/
        const result = await axios.post('http://localhost:5002/stores', {
            CollectionID: this.state.collection,
            BookID: this.state.bookid,
        })
    }
    getCollections = async(e) =>{
        try{
            const params = new URLSearchParams();
            params.append('username', Cookies.get('username'));
            const result = await axios.get(`http://localhost:5002/collectionsearch?${params.toString()}`);
            console.log(result.status);
            if (result.status === 200) {
                this.state.collections=result.data;
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
            }
        }
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
        let rating;
        if(this.state.averageRating === -1){
            rating = "No Results"
        }
        else{
            rating = parseFloat(this.state.averageRating).toFixed(1)
        }
        const contributors = this.state.info[0][5];
        let author;
        let publisher;
        if(typeof contributors !== 'undefined'){
            const contributor = contributors.split(',');
            author = contributor[0].trim();
            publisher = contributor.slice(1).join(',').trim();
            console.log(publisher == '')
            if(publisher === ''){
                publisher = "No data"
            }
        }

        const sectionList = this.state.sections.map((item, index) => (
            <div className="section-item" key={index}>
                <h4>Start time: {item[0]}</h4>
                <h4>End time: {item[1]}</h4>
                <h4>Start page: {item[2]}</h4>
                <h4>End page: {item[3]}</h4>
            </div>
        ));
        const listCollections = this.state.collections.map((item, index) => {
            return (
                <option value={item[0]}>{item[1]}</option>
            )
        })
        return (
            <div className="book-container">
                <div className="book-info">
                    <h3>Title: {this.state.info[0][1]}</h3>
                    <h4>Author and Publisher: {author}</h4>
                    <h4>Publisher: {publisher}</h4>
                    <h4>Release Date: {this.state.info[0][4]}</h4>
                    <h4>Audience: {this.state.info[0][3]}</h4>
                    <h4>Length: {this.state.info[0][2]} pages</h4>
                    <h4>Genre: {this.state.info[0][6]}</h4>
                    <h4>Average Rating: {rating}</h4>
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
                <div className="collection-add">
                    <button onClick={this.addBook}>Add book to collection</button>
                    <select id="addcol">
                        {listCollections}
                    </select>
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
                            <InputGroupText>Start Date</InputGroupText>
                            <Input onChange={this.changeStartDate} type="date"/>
                        </InputGroup>
                        <InputGroup className="input-group">
                            <InputGroupText>Start Time</InputGroupText>
                            <Input onChange={this.changeStartTime} type="time"/>
                        </InputGroup>
                        <InputGroup className="input-group">
                            <InputGroupText>End Date</InputGroupText>
                            <Input onChange={this.changeEndDate} type="date" />
                        </InputGroup>
                        <InputGroup className="input-group">
                            <InputGroupText>End Time</InputGroupText>
                            <Input onChange={this.changeEndTime} type="time" />
                        </InputGroup>
                        <InputGroup className="input-group">
                            <InputGroupText>Start Page</InputGroupText>
                            <Input onChange={this.changeStartPage} type="number" />
                        </InputGroup>
                        <InputGroup className="input-group">
                            <InputGroupText>End Page</InputGroupText>
                            <Input onChange={this.changeEndPage} type="number" />
                        </InputGroup>
                        {createSection}
                        <h2>Your Sections</h2>
                        {sectionList}
                    </form>
                </div>
            </div>
        );
    }




}    

export default Book;
