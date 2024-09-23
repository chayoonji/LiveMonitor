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
      setSuccessMessage('회원가입할때 등록했던 아이디를 입력해주세요');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/set-user-id', {
        userId,
      });
      console.log(response.data.message);
      setIsUserIdSet(true);
      setSuccessMessage('등록한 아이디로 데이터 베이스 설정에 성공했습니다');
    } catch (error) {
      console.error(
        '아이디로 데이터 베이스 설정하는데 문제가 있습니다:',
        error
      );
      setSuccessMessage('아이디로 데이터 베이스 설정하는데 실패했습니다');
    }
  };

  const handleUpload = async () => {
    if (!isUserIdSet) {
      console.error('데이터 베이스 설정을 안 했습니다');
      setSuccessMessage(
        '프로그램 페이지에서 데이터 베이스 설정을 먼저 해주세요'
      );
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
      setSuccessMessage('데이터 베이스에 파일 업로드를 성공적으로 마쳤습니다');
    } catch (error) {
      console.error('파일 업로드하는데 문제가 발생했습니다:', error);
      setSuccessMessage(
        '데이터 베이스에 파일 업로드를 실패했습니다. 다시 시도해주세요'
      );
    }
  };

  return (
    <div className="main-container">
      <div className="upload-container">
        <h1 className="upload-title">DB 설정</h1>
        <div className="upload-input-group">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디를 입력해주세요"
            className="upload-input"
          />
          <button onClick={handleSetUserId} className="upload-button">
            데이터 베이스 설정
          </button>
        </div>

        {isAdmin && isUserIdSet && (
          <button onClick={handleUpload} className="upload-button">
            JSON 파일 DB에 업로드
          </button>
        )}

        {/* userId가 설정되지 않았으면 그래프를 숨김 */}
        {isUserIdSet && userId ? (
          <div>{/* 그래프를 표시하는 컴포넌트 */}</div>
        ) : (
          <p>그래프를 표시하려면 아이디를 먼저 입력하세요.</p>
        )}

        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default UploadButton;
