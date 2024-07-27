import React, { useState } from 'react';
import axios from 'axios';
import './Board.css';

const Board = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(''); // 작성자 입력 상태 추가
  const [password, setPassword] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // 로그인 상태 관리

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/posts", {
        title,
        content,
        password: password || null, // 비밀번호가 없으면 null
        author: loggedInUser ? loggedInUser.name : author, // 로그인된 사용자 이름을 우선으로 하고, 없으면 입력된 작성자 이름 사용
      });
      console.log("Post created:", response.data);
      alert("Post created successfully");
      setTitle("");
      setContent("");
      setPassword("");
      setAuthor(""); // 작성자 초기화
      setIsFormVisible(false);
      // fetchPosts(); // 게시물 생성 후 새 목록 가져오기
    } catch (error) {
      console.error("Error creating post:", error.message);
      alert("Error creating post: " + error.message); // 사용자에게 오류 메시지 표시
    }
  };

  return (
    <div>
      {isFormVisible ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label>Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <button onClick={() => setIsFormVisible(true)}>Add Post</button>
      )}
    </div>
  );
};

export default Board;
