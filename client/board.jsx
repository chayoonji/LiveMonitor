import React, { useState } from 'react';
import axios from 'axios';
import './Board.css';

const Board = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/posts", {
        title,
        content,
        password: password || null,
        author: loggedInUser ? loggedInUser.name : author,
      });
      console.log("Post created:", response.data);
      alert("Post created successfully");
      setTitle("");
      setContent("");
      setPassword("");
      setAuthor("");
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error creating post:", error.message);
      alert("Error creating post: " + error.message);
    }
  };

  const handleConvert = async () => {
    try {
      const response = await axios.post("http://localhost:3001/convert-excel");
      alert(response.data);
    } catch (error) {
      console.error("Error converting file:", error.message);
      alert("Error converting file: " + error.message);
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
        <>
          <button onClick={() => setIsFormVisible(true)}>Add Post</button>
          <button onClick={handleConvert}>Convert Excel to JSON</button>
        </>
      )}
    </div>
  );
};

export default Board;
