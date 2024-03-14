import { Component } from "react";
import { Link } from "react-router-dom";

class MainPage extends Component
{
    render()
    {
        return(
            <div>
                <h1>Main</h1>
                <Link to ="/login">
                    <button>to Login</button>
                </Link>
            </div>
        )
    }
}

export default MainPage