import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './PostDetail.css';

const PostDetail = ({ posts }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = posts.find((post) => post.id === parseInt(postId));

  if (!post) {
    return <p>글을 찾을 수 없습니다.</p>;
  }

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="post-detail-container">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <small>{post.date}</small>
      <button onClick={handleBackClick} className="back-button">
        뒤로가기
      </button>
    </div>
  );
};

export default PostDetail;
