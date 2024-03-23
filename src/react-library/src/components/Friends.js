// The application must also allow an user to unfollow a another user

import {Component} from "react";
import {InputGroup, Input, Button} from 'reactstrap';
import axios from "axios";
import './styling/Search.css';
import Cookies from 'js-cookie';

class Friends extends Component
{
    constructor(props){
        super(props);
        this.state={
            friends: [],
        }
    }

    searchData = async (e) => {
        e.preventDefault();
        try{
            if(this.state.searchType === "user"){
                const params = new URLSearchParams();
                params.append({Username: Cookies.get('username')});                
                const response = await axios.get(`http://localhost:5002/friends?${params.toString()}`);
                if(response.data == null || response.data.length == 0){
                    this.setState({friends: []})
                    alert("No result.")
                }
                else{
                    this.setState({friends: response.data});
                }
            }
        } catch(error){
            if(error.response && error.response.status === 401){
                alert('No Results')
            }
        }
    }

    componentDidMount = () => {
        this.searchData();
    }

    render()
    {
        return(
          <div>
              {this.state.friends.map((stuff, index) => (
                <div className="search-result-item" key={index}>
                  <h3>{stuff[0]}</h3>
                </div>
              ))}
          </div>
        )
    }
}

export default Friends;