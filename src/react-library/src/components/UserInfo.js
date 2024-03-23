import { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";

class UserInfo extends Component
{
    constructor(props){
        super(props);
        this.state = {
            currentUser: "",
            checkUser: "",
            info: [],
            dataLoaded: false,
        }
    }

    getUserInfo = async (e) => {
        try{
            const params = new URLSearchParams({Username: this.state.checkUser});
            const response = await axios.get(`http://localhost:5002/bookuser?${params.toString()}`);
            this.setState({info: response.data.data, dataLoaded:true})
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
    render()
    {
        if(!this.state.dataLoaded){
            return(
            <div>
                <h1>Loading...</h1>
            </div>
            )
        }

        return(
            <div>
                <h4>{this.state.currentUser}</h4>
                <h4>{this.state.checkUser}</h4>
                <h4>{this.state.info[0][0]}</h4>
            </div>
        )
    }
}

export default UserInfo;
