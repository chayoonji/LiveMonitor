import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${id}`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setUploadedFiles(response.data.files || []);
      } catch (error) {
        setError('게시물을 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching post:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdatePost = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await axios.put(`http://localhost:3001/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFiles(response.data.files);

      alert('게시물이 성공적으로 수정되었습니다.');
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating post:', error.message);
      alert('게시물 수정 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleAddFile = () => {
    setFiles([...files, null]); // Add a placeholder for a new file input
  };

  const handleFileChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleDeletePost = async () => {
    try {
      const response = await axios.post('http://localhost:3001/posts/check-password', {
        postId: id,
        password: deletePassword,
      });

      if (response.data.valid) {
        await axios.delete(`http://localhost:3001/posts/${id}`, {
          data: { password: deletePassword },
        });

        alert('게시물이 성공적으로 삭제되었습니다.');
        navigate('/', { state: { refresh: true } });
      } else {
        alert('비밀번호가 틀립니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
      alert('게시물 삭제 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleDiagnosisClick = () => {
    navigate(`/diagnosis`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="post-detail-container">
      <h1>{title}</h1>
      <small>by {post.author}</small>
      <p>{content}</p>

      {uploadedFiles.length > 0 && (
        <div>
          <h3 style={{ color: 'red' }}>첨부 파일:</h3>
          {uploadedFiles.map((file, index) => (
            <div key={index}>
              <a href={`http://localhost:3001/uploads/${file}`} download style={{ color: 'red' }}>
                {file}
              </a>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleDiagnosisClick}>진단 결과 보기</button>

      {showEditForm ? (
        <div>
          {files.map((_, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, index)}
              />
              <button onClick={() => handleRemoveFile(index)}>삭제</button>
            </div>
          ))}
          <button onClick={handleAddFile}>추가</button>
          <button onClick={handleUpdatePost}>수정</button>
          <button onClick={() => setShowEditForm(false)}>취소</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setShowEditForm(true)}>수정</button>
          <button
            onClick={() => setDeletePassword(prompt('삭제를 확인하기 위해 비밀번호를 입력하세요'))}
          >
            삭제
          </button>
          {deletePassword && (
            <button onClick={handleDeletePost}>삭제 확인</button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetail;
