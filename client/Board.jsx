import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Board.css';

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [isWriting, setIsWriting] = useState(false); // isWriting 상태 선언
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/posts', {
        title,
        content,
        password: password || null,
        author: loggedInUser ? loggedInUser.name : author,
      });
      console.log('Post created:', response.data);
      alert('Post created successfully');
      setTitle('');
      setContent('');
      setPassword('');
      setAuthor('');
      setIsWriting(false); // 글쓰기 모드 종료
      const updatedPosts = await axios.get('http://localhost:3001/posts');
      setPosts(updatedPosts.data);
    } catch (error) {
      console.error('Error creating post:', error.message);
      alert('Error creating post: ' + error.message);
    }
  };

  const handleWriteClick = () => {
    setIsWriting(true); // isWriting 상태를 true로 설정하여 글쓰기 모드로 전환
  };

  const handleCancelClick = () => {
    setIsWriting(false); // isWriting 상태를 false로 설정하여 글쓰기 모드 종료
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
          />
          <button type="submit">글쓰기</button>
          <button type="button" onClick={handleCancelClick}>
            취소
          </button>
        </form>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-item">
              <h2>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              <small>{post.date}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Board;
