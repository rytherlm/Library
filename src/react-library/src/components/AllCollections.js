import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styling/AllCollections.css';
import Cookies from 'js-cookie';
// Users will be to see the list of all their collections by name in ascending order. The list
// must show the following information per collection:
// – Collection’s name
// – Number of books in the collection
// – Total length of the books (in pages) in the collection

// Users will be able to create collections of books.

//  Users can modify the name of a collection. They can also delete an entire collection
const AllCollections = () => {
    const [collectionName, setCollectionName] = useState('');
    var username = Cookies.get('username');
    const [myCollections, setMyCollections] = useState([]);
    const [renameInputs, setRenameInputs] = useState({}); 

    const listCollections = async (e) => {
        try {
            const params = new URLSearchParams();
            params.append('username', Cookies.get('username'));
            const result = await axios.get(`http://localhost:5002/collectionsearch?${params.toString()}`);
            if (result.status === 200) {
                setMyCollections(result.data);
                const initialRenameInputs = result.data.reduce((acc, item) => ({ ...acc, [item[0]]: '' }), {});
                setRenameInputs(initialRenameInputs);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('No results.');
            }
        }
    };

    useEffect(() => {
        listCollections();
    }, []); 

    const createCollection = async (e) => {
        e.preventDefault();
        if (!collectionName) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const result = await axios.post('http://localhost:5002/collection', {
                Username: username,
                CollectionName: collectionName,
            });
            if (result.status === 200) {
                listCollections();
            }
        } catch (error) {
            console.error('Collection creation failed: ', error);
        }
    };

    const deleteCollection = async (id) => {
        try {
            const result = await axios.delete(`http://localhost:5002/collection?CollectionID=${id}`);
            if (result.data === 200) {
                listCollections();
            }
        } catch (error) {
            console.error('Error deleting collection: ', error);
        }
    }

    const renameCollection = async (id, newName) => {
        try {
            const result = await axios.put('http://localhost:5002/collection?', {
                Username: username,
                CollectionID: id,
                CollectionName: newName
            });
            if (result.data === 200) {
                listCollections();
            }
        } catch (error) {
            console.error('Collection rename failed: ', error);
        }
    }

    const handleRenameChange = (id, newName) => {
        setRenameInputs({ ...renameInputs, [id]: newName });
    }

    const collection_list = myCollections.map((item, index) => {
        return (
            <div className="list" key={index}>
                <Link to={`/collections/${item[0]}`} className="link-no-underline" onClick={() => Cookies.set("collectionId", item[0])}>
                    <div className="list-item">
                        <h3>CollectionName: {item[1]}</h3>
                        <h4>Books: {item[2]}</h4>
                        <h4>Pages: {item[3]}</h4>
                    </div>
                </Link>
                <input
                    type="text"
                    placeholder="Collection Rename"
                    value={renameInputs[item[0]] || ''}
                    onChange={(e) => handleRenameChange(item[0], e.target.value)}
                />
                <button onClick={() => renameCollection(item[0], renameInputs[item[0]])}>Rename Collection</button>
                <button onClick={() => deleteCollection(item[0])}>Remove</button>
            </div>
        );
    });

    return (
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
