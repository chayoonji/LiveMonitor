import React, { useState } from 'react';
import axios from 'axios';
import './UploadButton.css';
import { useAuth } from './Context/AuthContext';

const UploadButton = () => {
  const { isAdmin, userId, setUserId } = useAuth(); // AuthContext에서 isAdmin과 userId 가져오기
  const [isUserIdSet, setIsUserIdSet] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL; // API URL을 환경 변수에서 가져옴

  const handleSetUserId = async () => {
    if (!userId) {
      setSuccessMessage('Please enter a User ID.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/set-user-id`, {
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
