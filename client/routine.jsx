import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UploadButton = () => {
    const [userId, setUserId] = useState('');
    const [isUserIdSet, setIsUserIdSet] = useState(false);

    const handleSetUserId = async () => {
        try {
            const response = await axios.post('http://localhost:3001/set-user-id', { userId });
            console.log(response.data.message);
            setIsUserIdSet(true);
        } catch (error) {
            console.error('Error setting user ID:', error);
        }
    };

    const handleUpload = async () => {
        if (!isUserIdSet) {
            console.error('User ID not set.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3001/upload/${userId}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <div>
            <h1>JSON 파일 업로드</h1>
            <div>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID"
                />
                <button onClick={handleSetUserId}>Set User ID</button>
            </div>
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadButton;
