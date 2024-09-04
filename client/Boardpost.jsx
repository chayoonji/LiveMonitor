import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3002/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, [location.state?.refresh]); // 위치 상태 변경 시 게시물 업데이트

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3002/posts', {
        title,
        content,
        author,
        password,
      });
      alert('글이 성공적으로 작성되었습니다.');
      setTitle('');
      setContent('');
      setPassword('');
      setAuthor('');
      setIsWriting(false);

      // 게시물 목록 새로고침
      const updatedPosts = await axios.get('http://localhost:3002/posts');
      setPosts(updatedPosts.data);
    } catch (error) {
      console.error('Error creating post:', error.message);
      alert('글 작성 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleWriteClick = () => {
    setIsWriting(true);
  };

  const handleCancelClick = () => {
    setIsWriting(false);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPasswordModal(true);
    setError('');
    setPasswordInput('');
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3002/posts/check-password',
        {
          postId: selectedPost._id,
          password: passwordInput,
        }
      );

      if (response.data.valid) {
        // 선택한 게시물의 상세 정보 가져오기
        const postResponse = await axios.get(
          `http://localhost:3002/posts/${selectedPost._id}`
        );
        // 상세 페이지로 이동
        navigate(`/post/${selectedPost._id}`, {
          state: { post: postResponse.data },
        });
        setShowPasswordModal(false);
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Error verifying password:', error.message);
      setError('비밀번호 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="main-container board-page">
      <div className="board-container">
        <div className="board-header">
          <h1>게시판</h1>
          {!isWriting && (
            <button className="write-button" onClick={handleWriteClick}>
              글쓰기
            </button>
          )}
        </div>
        {isWriting ? (
          <form onSubmit={handleSubmit} className="board-form">
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="작성자"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="form-buttons">
              <button type="submit">작성 완료</button>
              <button type="button" onClick={handleCancelClick}>
                취소
              </button>
            </div>
          </form>
        ) : (
          <div className="posts-list">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="post-item">
                  <h2 onClick={() => handlePostClick(post)}>{post.title}</h2>
                  <small>작성자: {post.author}</small>
                </div>
              ))
            ) : (
              <p>게시물이 없습니다.</p>
            )}
          </div>
        )}

        {showPasswordModal && selectedPost && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedPost.title}</h2> {/* 선택된 게시물의 제목 표시 */}
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="modal-input"
              />
              {error && <p className="error-message">{error}</p>}
              <div className="modal-buttons">
                <button onClick={handlePasswordSubmit}>확인</button>
                <button onClick={() => setShowPasswordModal(false)}>
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;