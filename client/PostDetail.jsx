import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${id}`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
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
    try {
      await axios.put(`http://localhost:3001/posts/${id}`, {
        title,
        content,
      });
      alert('게시물이 성공적으로 수정되었습니다.');
      navigate('/'); // 홈 페이지로 이동
    } catch (error) {
      console.error('Error updating post:', error.message);
      alert('게시물 수정 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      // 비밀번호를 확인하는 요청을 먼저 보냅니다.
      const response = await axios.post('http://localhost:3001/posts/check-password', {
        postId: id,
        password: deletePassword
      });
  
      if (response.data.valid) {
        // 비밀번호가 맞으면 게시물을 삭제합니다.
        await axios.delete(`http://localhost:3001/posts/${id}`, {
          data: { password: deletePassword } // 비밀번호를 데이터로 전송
        });
  
        alert('게시물이 성공적으로 삭제되었습니다.');
        navigate('/'); // 홈 페이지로 이동
      } else {
        alert('비밀번호가 틀립니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
      alert('게시물 삭제 중 오류가 발생했습니다: ' + error.message);
    }
  };
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="post-detail-container">
      <h1>{post.title}</h1>
      <small>by {post.author}</small>
      <p>{post.content}</p>

      {showEditForm ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleUpdatePost}>수정</button>
          <button onClick={() => setShowEditForm(false)}>취소</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setShowEditForm(true)}>수정</button>
          <button onClick={() => setDeletePassword(prompt('삭제를 확인하기 위해 비밀번호를 입력하세요'))}>
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
