import React, { useState } from 'react';
import axios from 'axios';
import './UploadButton.css';
import { useAuth } from './Context/AuthContext';

const UploadButton = () => {
  const { isAdmin, userId, setUserId } = useAuth(); // AuthContext에서 isAdmin과 userId 가져오기
  const [isUserIdSet, setIsUserIdSet] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSetUserId = async () => {
    if (!userId) {
      setSuccessMessage('Please enter a User ID.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/set-user-id', {
        userId,
      });
      console.log(response.data.message);
      setIsUserIdSet(true);
      setSuccessMessage('User ID has been set successfully!');
    } catch (error) {
      console.error('Error setting user ID:', error);
      setSuccessMessage('Failed to set User ID. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (!isUserIdSet) {
      console.error('User ID not set.');
      setSuccessMessage('Please set the User ID first.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3002/upload/${userId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      setSuccessMessage('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      setSuccessMessage('File upload failed. Please try again.');
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">JSON 파일 업로드</h1>
      <div className="upload-input-group">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="upload-input"
        />
        <button onClick={handleSetUserId} className="upload-button">
          Set User ID
        </button>
      </div>

      {isAdmin && isUserIdSet && (
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      )}

      {/* userId가 설정되지 않았으면 그래프를 숨김 */}
      {isUserIdSet && userId ? (
        <div>{/* 그래프를 표시하는 컴포넌트 */}</div>
      ) : (
        <p>그래프를 표시하려면 User ID를 먼저 입력하세요.</p>
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default UploadButton;
