import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';
import './styling/AllCollections.css';
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
    var collectionId = 0;
    var username = Cookies.get('username');
    const [myCollections, setMyCollections] = useState([]);
    const listCollections = async (e) => {
        try{
            const params = new URLSearchParams();
            params.append('username', Cookies.get('username'));
            const result = await axios.get(`http://localhost:5002/collectionsearch?${params.toString()}`);
            console.log(result.status);
            if (result.status === 200) {
                setMyCollections(result.data);
                console.log(result.data);
                console.log(myCollections);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('No results.');
            }
        }
    }
    window.onload = listCollections;
    const createCollection = async (e) => {
        e.preventDefault();

// Users can add and delete books from their collection.


        if(!collectionName)
        {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const result = await axios.post('http://localhost:5002/collection', {
                Username: username,
                CollectionName: collectionName,
            });
            console.log(result.status);
            if(result.status === 200)
            {
                listCollections(e);
            }
        } catch (error) {
            console.error('Collection creation failed: ', error);
        }
    };
    const deleteCollection = (id) => {
        collectionId = id;
        deleteC();
    }
    const deleteC = async(e) => {        
        const params = new URLSearchParams({"CollectionID": collectionId});
        console.log(collectionId);
        const result = await axios.delete(`http://localhost:5002/collection?${params.toString()}`);
            console.log(result.data);
            if(result.data === 200)
            {
                listCollections();
            }
    }
    const renameCollection = async(e) => {
        console.log(collectionId);
        try {
        const result = await axios.put('http://localhost:5002/collection?', {
            Username: username,
            CollectionID: collectionId,
            CollectionName: collectionName
        }
        );
        console.log(result.data);
        if(result.data === 200)
            {   
                listCollections();
            }
    } catch (error) {
        console.error('Collection rename failed: ', error);
    }
            
    }
    const rename = (id) => {
        collectionId = id;
        renameCollection();
    }
    const setCollectionInfo = (id) => {
        Cookies.set("collectionId", id)
    }
    const collection_list = myCollections.map((item, index) => {
        const linkPath = `/collections/${item[0]}`;
        return (
            <div class="list">
            <Link to={linkPath} className="link-no-underline" key={index} onClick={() => setCollectionInfo(item[0])}>
                <div class="list-item">
                    {
                    <>
                        <h3>CollectionName: {item[1]}</h3>
                        <h4>Books: {item[2]}</h4>
                        <h4>Pages: 0{item[3]}</h4>
                        
                    </>
                    }
                </div>
            </Link>
                <input
                    type="text"
                    placeholder="Collection Rename"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                />
                <button onClick={() => {rename(item[0])}}>Rename Collection</button>
            <button onClick={() => {deleteCollection(item[0])}}>Remove</button>
            </div>
        );
    });
    return(
        <div className='collections'>
            <div className='list-collections'>
                <h1>Collections</h1>
                {collection_list}
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
export default AllCollections;