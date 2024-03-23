import {Component} from "react";
import {InputGroup, Input, Button} from 'reactstrap';
import axios from "axios";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";

class Friends extends Component
{
    constructor(props){
        super(props);
        this.state={
            friends: [],
            dataLoaded: false,
        }
    }

    searchData = async () => {
        try{
            const params = new URLSearchParams({username: Cookies.get('username')});
            const response = await axios.get(`http://localhost:5002/friends?${params.toString()}`);
            if(response.data == null || response.data.length == 0){
                this.setState({friends: []})
                alert("No result.")
            }
            else{
                this.setState({friends: response.data, dataLoaded:true});
            }
        } catch(error){
            console.log(error)
        }
    }

    componentDidMount = () => {
        this.searchData();
    }

    setUserInfo = (name) => {
        Cookies.set("UserInfoName", name)
    }

    render()
    {
        if(!this.state.dataLoaded){
            return(
                <h1>Loading...</h1>
            )
        }
        return(
          <div>
            <h1>Friends</h1>
              {this.state.friends.map((stuff, index) => (
                <div key={index}>
                    <Link to={`/userinfo/${stuff[1]}`} className = "link-no-underline" onClick={this.setUserInfo(stuff[1])}>
                    <h3>{stuff[2]} {stuff[3]}</h3>
                    <h4>{stuff[1]}</h4>
                    </Link>
                </div>
              ))}
          </div>
        )
    }
}

export default Friends;