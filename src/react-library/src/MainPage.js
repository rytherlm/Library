import { Component } from "react";
import { Link } from "react-router-dom";

class MainPage extends Component
{
    constructor(props){
        super(props);
        this.state = {
            bookInfo: [],
        }
    }

    getMethod = () => {
        //With Flask CORS enabled, we can directly call the server on port 5000
        fetch('http://localhost:5002/book/1') //this gets book #1
         .then( 
             (response) => 
             {
                return response.json() ;
             }
             )//The promise response is returned, then we extract the json data
         .then (jsonOutput => //jsonOutput now has result of the data extraction
                  {
                     this.updateData(jsonOutput)
                    }
              )
         .catch((error => console.log("**Fetch exception:" + error)))
      }

      postMethod= () =>
      {
          let url = 'http://localhost:5002/book';
          let jData = JSON.stringify({
              Title: "TestBook",
              ReleaseDate: 1000,
              Length: 69,
              Audience: "Kids",
          });
          fetch(url,
              { method: 'POST',
              body: jData,
              headers: {"Content-type": "application/json; charset=UTF-8"}        
              })
          .then(
              (response) => 
              {
                  if (response.status === 200)
                      return (response.json()) ;
                  else
                      return ([ ["status ", response.status]]);
              }
              )//The promise response is returned, then we extract the json data
          .then ((jsonOutput) => //jsonOutput now has result of the data extraction, but don't need it in this case
                  {
                      this.getMethod();
                  }
              )
          .catch((error) => 
              {console.log(error);
              this.getMethod();
                  } )
      }
  
    
    updateData = (apiResponse) => {
        this.setState({bookInfo: apiResponse})
    }

    componentDidMount(){
        this.getMethod();
    } 

    render()
    {
        return(
            <div>
                <h1>Main</h1>
                <Link to ="/login">
                    <button>to Login</button>
                </Link>
                <h1>{this.state.bookInfo}</h1>
            </div>
        )
    }
}

export default MainPage