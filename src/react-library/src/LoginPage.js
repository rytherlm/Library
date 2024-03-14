import { Component } from "react";
import { Link } from "react-router-dom";

class LoginPage extends Component
{
    render()
    {
        return(
            <div>
                <h1>Login</h1>
                <Link to ="/main">
                    <button>to Main</button>
                </Link>
            </div>
        )
    }
}

export default LoginPage