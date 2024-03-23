import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UserInfo() {
    const { username } = useParams();
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
        setCurrentUser(username);
    }, [username]);

    return (
        <div>
            <h1>{currentUser}</h1>
        </div>
    );
}

export default UserInfo;
