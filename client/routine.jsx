import React, { useState } from 'react';
import axios from 'axios';
import './UploadButton.css';
import { useAuth } from './Context/AuthContext';

const UploadButton = () => {
  const { isAdmin } = useAuth(); // AuthContext에서 isAdmin 상태 가져오기
  const [userId, setUserId] = useState('');
  const [isUserIdSet, setIsUserIdSet] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false); // For toggling help guide

  const handleSetUserId = async () => {
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

  const toggleHelp = () => {
    setShowHelp(!showHelp); // Toggle help visibility
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">JSON 파일 업로드</h1>
      <div className="upload-input-group">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID를 입력하세요."
          className="upload-input"
        />
        <button onClick={handleSetUserId} className="upload-button">
          입력하기
        </button>
      </div>

      {isAdmin && (
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Help Section */}
      <button onClick={toggleHelp} className="help-button">
        {showHelp ? 'Close Help' : 'Show Help'}
      </button>

      {showHelp && (
        <div className="help-section">
          <h2>도움말</h2>
          <p>
            프로그램 페이지에서 회원가입 할 때 입력한 User ID를 위에 입력하고
            <strong> 입력하기</strong> 버튼을 클릭하세요.
          </p>
          <p>
            User ID가 설정된 후, <strong>Upload</strong> 버튼을 클릭해 JSON
            파일을 업로드할 수 있습니다. <br></br>모든 그래프 및 표는 User ID가
            설정된 후에만 보여집니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadButton;
