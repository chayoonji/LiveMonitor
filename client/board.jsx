import React, { useState, useEffect } from "react";
import axios from "axios";
import './Board.css'; // 외부 CSS 파일을 포함합니다.

const Board = ({ loggedInUser }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시물 상태

  // 게시물 목록 가져오기
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/posts", {
        title,
        content,
        author: loggedInUser ? loggedInUser.name : "Unknown",
      });
      console.log("Post created:", response.data);
      alert("Post created successfully");
      setTitle("");
      setContent("");
      setIsFormVisible(false);
      fetchPosts(); // 게시물 생성 후 새 목록 가져오기
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post");
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="board-container">
      <div className="board-wrapper">
        <h2>Board</h2>
        <button onClick={() => setIsFormVisible(true)}>Create Post</button>
        {isFormVisible && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        )}
        <div className="posts-list">
          <h3>Posts</h3>
          {posts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            <ul>
              {posts.map((post) => (
                <li key={post._id} onClick={() => handlePostClick(post)}>
                  <h4>Title: {post.title}</h4>
                  <small>By: {post.author}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedPost && (
          <div className="post-detail">
            <h4>Title: {selectedPost.title}</h4>
            <p>Content: {selectedPost.content}</p>
            <small>Author: {selectedPost.author}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
