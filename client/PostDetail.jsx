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
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${id}`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setUploadedFile(response.data.file);
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
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.put(`http://localhost:3001/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFile(response.data.file);

      alert('게시물이 성공적으로 수정되었습니다.');
      setShowEditForm(false); // 수정 폼 닫기
    } catch (error) {
      console.error('Error updating post:', error.message);
      alert('게시물 수정 중 오류가 발생했습니다: ' + error.message);
    }
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
    navigate(`/diagnosis/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="post-detail-container">
      <h1>{title}</h1>
      <small>by {post.author}</small>
      <p>{content}</p>

      {uploadedFile && (
        <div>
          <h3>첨부 파일:</h3>
          <a href={`http://localhost:3001/uploads/${uploadedFile}`} download>
            {uploadedFile}
          </a>
        </div>
      )}

      <button onClick={handleDiagnosisClick}>진단 결과 보기</button>

      {showEditForm ? (
        <div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
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
