import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { useAuth } from './Context/AuthContext';

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
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const postsPerPage = 4; // 페이지당 표시할 게시물 수

  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth(); // AuthContext에서 isAdmin 상태 가져오기

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
  }, [location.state?.refresh]);

  useEffect(() => {
    // Load status from localStorage if available
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  useEffect(() => {
    // Save posts to localStorage whenever posts change
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  // 페이지 이동 핸들러
  const handleNextPage = () => {
    if (currentPage < Math.ceil(posts.length / postsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // 현재 페이지에 해당하는 게시물 목록을 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3002/posts', {
        title,
        content,
        author,
        password,
        status
      });
      alert('글이 성공적으로 작성되었습니다.');
      setTitle('');
      setContent('');
      setPassword('');
      setAuthor('');
      setIsWriting(false);

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
    if (isAdmin) {
      // 관리자인 경우 비밀번호 확인 없이 바로 게시물 보기
      navigate(`/post/${post._id}`, {
        state: { post }
      });
    } else {
      setShowPasswordModal(true);
      setError('');
      setPasswordInput('');
    }
  };

  const handlePasswordSubmit = async () => {
    if (isAdmin) {
      // 관리자인 경우 비밀번호 확인 로직을 실행하지 않음
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3002/posts/check-password',
        {
          postId: selectedPost._id,
          password: passwordInput,
        }
      );
  
      if (response.data.valid) {
        const postResponse = await axios.get(
          `http://localhost:3002/posts/${selectedPost._id}`
        );
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
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <div key={post._id} className="post-item">
                  <h2 onClick={() => handlePostClick(post)}>{post.title}</h2>
                  <small>작성자: {post.author}</small>
                  <small>진행 상태: {post.status}</small>
                </div>
              ))
            ) : (
              <p>게시물이 없습니다.</p>
            )}
          </div>
        )}

        {/* 페이지네이션 버튼 */}
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            이전
          </button>
          <span>{`페이지 ${currentPage}`}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
          >
            다음
          </button>
        </div>

        {!isAdmin && showPasswordModal && selectedPost && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedPost.title}</h2>
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
