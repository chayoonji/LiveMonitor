import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UploadButton = () => {
    const userId = Cookies.get('userId'); // 쿠키에서 userId 가져오기

    const handleUpload = async () => {
        if (!userId) {
            console.error('사용자가 로그인하지 않았습니다.');
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
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadButton;
