import React, { useState } from 'react';
import axios from 'axios';
import './UploadButton.css'; // CSS 파일을 임포트합니다.

const UploadButton = () => {
  const [userId, setUserId] = useState('');
  const [isUserIdSet, setIsUserIdSet] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSetUserId = async () => {
    try {
      const response = await axios.post('http://localhost:3002/set-user-id', {
        userId,
      });
      console.log(response.data.message);
      setIsUserIdSet(true);
      setSuccessMessage('User ID has been set successfully!');
      // 데이터 초기화
      resetData();
    } catch (error) {
      console.error('Error setting user ID:', error);
      setSuccessMessage('Failed to set User ID. Please try again.');
    }
  };

  const resetData = () => {
    // 데이터 초기화 로직 추가 (예: 상태를 리셋하거나, 필요시 추가 작업 수행)
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
      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default UploadButton;