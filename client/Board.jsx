import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Board.css';

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: posts.length + 1,
      title: title,
      content: content,
      date: new Date().toLocaleString(),
    };
    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
    setIsWriting(false);
  };

  const handleWriteClick = () => {
    setIsWriting(true);
  };

  const handleCancelClick = () => {
    setIsWriting(false);
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
