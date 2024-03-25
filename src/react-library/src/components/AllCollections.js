import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate,Link} from 'react-router-dom';
import './styling/AllCollections.css';
import Cookies from 'js-cookie';

// Users will be to see the list of all their collections by name in ascending order. The list
// must show the following information per collection:
// – Collection’s name
// – Number of books in the collection
// – Total length of the books (in pages) in the collection


// Users will be able to create collections of books.

//  Users can modify the name of a collection. They can also delete an entire collection
const newCollection = () => {
    const [username] = useState('');
    const [collectionName, setCollectionName] = useState('');

    createCollection = async (e) => {
        e.preventDefault();

        if(!collectionName)
        {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const result = await axios.post('http://localhost:5002/myCollections', {
                Username: Cookies.get('username'),
                CollectionName: collectionName,
            });
            console.log(result.status);
            if(result.status === 201)
            {
                navigate('./' + collectionName);
            }
        } catch (error) {
            console.error('Collection creation failed: ', error);
        }
    };

    render()
    {
        return
        {
            <div className="new-collection">
                <form onSubmit={createCollection} className="collection-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Collection Name"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                    />
                    <button type="submit">Create Collection</button>
                </form>
            </div>
        }
    }
};