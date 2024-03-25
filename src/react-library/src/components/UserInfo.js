import { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {Button} from "reactstrap"
import './styling/User.css'

class UserInfo extends Component
{
    constructor(props){
        super(props);
        this.state = {
            currentUser: "",
            checkUser: "",
            info: [],
            dataLoaded: false,
            isFriends: false,
        }
    }

    getUserInfo = async (e) => {
        try{
            const params = new URLSearchParams({Username: this.state.checkUser});
            const response = await axios.get(`http://localhost:5002/bookuser?${params.toString()}`);
            const paramstwo = new URLSearchParams({currentuser: this.state.currentUser, checkuser: this.state.checkUser});
            const responsetwo = await axios.get(`http://localhost:5002/friends?${paramstwo.toString()}`);
            console.log(responsetwo.data)
            if(responsetwo.data === null || responsetwo.data.length === 0){
                this.setState({isFriends: false, info: response.data.data, dataLoaded:true})
            }
            else{
                this.setState({isFriends: true, info: response.data.data, dataLoaded:true})
            }
        } catch(error){
            console.log(error)
        }
    }

    followClick = async (e) => {
        try{
            if(this.state.isFriends){
                const paramstwo = new URLSearchParams({currentuser: this.state.currentUser, checkuser: this.state.checkUser});
                const response = await axios.delete(`http://localhost:5002/friends?${paramstwo.toString()}`)
                if(response.status === 200){
                    this.setState({isFriends: false})
                }
            }
            else{
                const response = await axios.post('http://localhost:5002/friends', {
                    currentuser: this.state.currentUser,
                    checkuser: this.state.checkUser
                });
                if(response.status === 200){
                    this.setState({isFriends: true})
                }
            }
        } catch(error){
            console.log(error)
        }
    }

    componentDidMount = () => {
        this.setState({ 
            checkUser: Cookies.get('UserInfoName'),
            currentUser: Cookies.get('username')
        }, () => {
            this.getUserInfo();
        });
    }
    render() {
        let followButton;
        if (this.state.isFriends) {
          followButton = (
            <Button className="userButton" type="submit" onClick={() => this.followClick()}>Unfollow</Button>
          );
        } else {
          followButton = (
            <Button className="userButton" type="submit" onClick={() => this.followClick()}>Follow</Button>
          );
        }
        if (!this.state.dataLoaded) {
          return (
            <div className="user">
                <div className="loading-message">Loading...</div>
            </div>
          );
        }
    
        return (
          <div className="user">
            <h1>Username: {this.state.checkUser}</h1>
            <h2>First Name: {this.state.info[0][1]}</h2>
            <h2>Last Name: {this.state.info[0][2]}</h2>
            {followButton}
          </div>
        );
      }
    }
    
export default UserInfo;