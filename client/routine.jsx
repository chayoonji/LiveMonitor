import React, { useState } from 'react';
import axios from 'axios';

const UploadButton = () => {
    const [userId, setUserId] = useState('');
    const [isUserIdSet, setIsUserIdSet] = useState(false);

    const handleSetUserId = async () => {
        try {
            const response = await axios.post('http://localhost:3001/set-user-id', { userId });
            console.log(response.data.message);
            setIsUserIdSet(true);
            // 데이터 초기화
            resetData();
        } catch (error) {
            console.error('Error setting user ID:', error);
        }
    };

    const resetData = () => {
        // 데이터 초기화 로직 추가 (예: 상태를 리셋하거나, 필요시 추가 작업 수행)
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
