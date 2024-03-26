import React, {Component, useState} from 'react';
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';
//import './styling/AllCollections.css';
import Cookies from 'js-cookie';
import { Container, Input, InputGroup } from 'reactstrap';

// Users will be to see the list of all their collections by name in ascending order. The list
// must show the following information per collection:
// – Collection’s name
// – Number of books in the collection
// – Total length of the books (in pages) in the collection

// Users will be able to create collections of books.

//  Users can modify the name of a collection. They can also delete an entire collection
const AllCollections = () => {
    const [collectionName, setCollectionName] = useState('');
    var myCollections = [];
    const createCollection = async (e) => {
        e.preventDefault();

        if(!collectionName)
        {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const result = await axios.post('http://localhost:5002/collection', {
                Username: Cookies.get('username'),
                CollectionName: collectionName,
            });
            console.log(result.status);
            if(result.status === 201)
            {
                //navigate('./' + collectionName);
            }
        } catch (error) {
            console.error('Collection creation failed: ', error);
        }
    };
    const listCollections = async (e) => {
        e.preventDefault();
        try{
            const params = new URLSearchParams();
            params.append('username', Cookies.get('username'));
            //const params = new URLSearchParams({ collection_id: 1 });
            const result = await axios.get(`http://localhost:5002/collectionsearch?${params.toString()}`);
            //const result = await axios.get(`http://localhost:5002/collectionsearch?a`);
            /*const result = await axios.get('http://localhost:5002/collectionsearch', {
                Username: Cookies.get('username'),
            });*/
            console.log(result.status);
            if (result.status === 200) {
                console.log(result);
                myCollections=result.data;
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('No results.');
            }
        }
    }
    var collection_list = myCollections.map((item, index) => {
        return (
            <div className="collection">
                <h1>Test</h1>
                <h3>Username: {item[1]}</h3>
                <h4>CollectionName: {item[0]}</h4>
             </div>
        );
    });
            
    return(
        <div className='collections'>
            <button onClick={listCollections}>List</button>
            <div className='list-collections' onLoad={listCollections}>
                <h1>Collections</h1>
                <Container>{collection_list}</Container>
            </div>
            <div className="new-collection">
                <form onSubmit={createCollection} className="collection-form">
                    <input
                        type="text"
                        placeholder="Collection Name"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                    />
                    <button type="submit">Create Collection</button>
                </form>
            </div>
        </div>
    );
};
/*
class AllCollections extends Component{
    constructor(props){
        super(props);
        this.state={
            username: "",
            collectionName: "",
            myCollections: [],
            collection_id: 1,
        }
    }
    createCollection = async (e) => {
        e.preventDefault();

        if(!this.state.collectionName)
        {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const result = await axios.post('http://localhost:5002/collection', {
                Username: Cookies.get('username'),
                CollectionName: this.state.collectionName,
            });
            console.log(result.status);
            if(result.status === 201)
            {
                //navigate('./' + collectionName);
            }
        } catch (error) {
            console.error('Collection creation failed: ', error);
        }
    }
    listCollections = async (e) => {
        e.preventDefault();
        console.log();
        try{
            const params = new URLSearcgihParams();
            params.append('username', Cookies.get('username'));
            const result = await axios.get(`http://localhost:5002/collectionsearch?${params.toString()}`);
            console.log(result.status);
            if (result.status === 200) {
                //
                this.setState({myCollections: result.data});
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('No results.');
            }
            else{
                alert(error)
            }
        }
    }
    setVal = (e) => {
        this.setState({collectionName: e.target.value})
    }
    render() {
        return (
            <div className='collections'>
                <button onClick={this.listCollections}>List</button>
                <div className='list-collections'>
                    <h1>Collections</h1>
                </div>
                <div className="new-collection">
                    <form onSubmit={this.createCollection} className="collection-form">
                        <InputGroup>
                        <Input
                            onChange={this.setVal}
                        />
                        </InputGroup>
                        <button type="submit">Create Collection</button>
                    </form>
                </div>
            </div>
        );
    }

}*/
export default AllCollections;