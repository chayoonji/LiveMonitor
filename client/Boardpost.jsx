import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Board.css';

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
  }, [location.state?.refresh]); // Dependency to trigger updates

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3002/posts', {
        title,
        content,
        author,
        password,
      });
      alert('Post created successfully');
      setTitle('');
      setContent('');
      setPassword('');
      setAuthor('');
      setIsWriting(false);

      // Refresh the posts list
      const updatedPosts = await axios.get('http://localhost:3002/posts');
      setPosts(updatedPosts.data);
    } catch (error) {
      console.error('Error creating post:', error.message);
      alert('Error creating post: ' + error.message);
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
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3002/posts/check-password', {
        postId: selectedPost._id,
        password: passwordInput,
      });

      if (response.data.valid) {
        // Fetch the full post details
        const postResponse = await axios.get(`http://localhost:3002/posts/${selectedPost._id}`);
        // Navigate to the detailed post view
        navigate(`/post/${selectedPost._id}`, { state: { post: postResponse.data } });
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      console.error('Error verifying password:', error.message);
      setError('Error verifying password');
    }
  };

  return (
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
          <button type="submit">글쓰기</button>
          <button type="button" onClick={handleCancelClick}>
            취소
          </button>
        </form>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post._id} className="post-item">
              <h2>
                <a href="#" onClick={() => handlePostClick(post)}>
                  {post.title}
                </a>
              </h2>
              <small>{post.author}</small>
            </div>
          ))}
        </div>
      )}

      {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>비밀번호 입력</h2>
            <input
              type="password"
              placeholder="비밀번호"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button onClick={handlePasswordSubmit}>확인</button>
            <button onClick={() => setShowPasswordModal(false)}>취소</button>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
