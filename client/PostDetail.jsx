import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

// 비밀번호 입력을 위한 커스텀 모달 컴포넌트
const PasswordModal = ({ onClose, onConfirm }) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    onConfirm(password);
    setPassword(''); // 비밀번호 초기화
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px', // 모달의 최대 너비 설정
          width: '90%', // 화면에 맞게 너비를 90%로 설정
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
          비밀번호 확인
        </h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%', // 입력 필드의 너비를 100%로 설정하여 모달 내부에 맞게 조정
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
          placeholder="비밀번호를 입력하세요"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0',
            }}
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0',
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false); // 모달 표시 여부
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${id}`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setAuthor(response.data.author);
      } catch (error) {
        setError('게시물을 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching post:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (showEditForm && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [showEditForm]);

  const handleUpdatePost = async () => {
    try {
      await axios.put(`http://localhost:3001/posts/${id}`, {
        title,
        content,
        author,
      });
      alert('게시물이 성공적으로 수정되었습니다.');
      setShowEditForm(false);
      navigate('/');
    } catch (error) {
      console.error('Error updating post:', error.message);
      alert('게시물 수정 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleDeletePost = async (password) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/posts/check-password',
        {
          postId: id,
          password: password,
        }
      );

      if (response.data.valid) {
        await axios.delete(`http://localhost:3001/posts/${id}`, {
          data: { password: password },
        });

        alert('게시물이 성공적으로 삭제되었습니다.');
        navigate('/');
      } else {
        setDeleteError('비밀번호가 틀립니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
      setDeleteError('게시물 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '0 20px',
      }}
    >
      <div
        style={{
          padding: '30px',
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: '#263043',
          borderRadius: '10px',
          color: '#ffffff',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {!showEditForm && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                borderBottom: '2px solid #6a24fe',
                paddingBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaArrowLeft
                  style={{
                    cursor: 'pointer',
                    marginRight: '15px',
                    color: '#6a24fe',
                    fontSize: '20px',
                  }}
                  onClick={() => navigate(-1)}
                />
                <h1
                  style={{
                    color: '#6a24fe',
                    marginRight: '20px',
                    fontSize: '28px',
                    margin: 0,
                  }}
                >
                  {post.title}
                </h1>
              </div>
              <small style={{ color: '#9e9ea4', fontSize: '16px', margin: 0 }}>
                by {post.author}
              </small>
            </div>
            <div
              style={{
                backgroundColor: '#f8f8f8',
                color: '#000000',
                padding: '20px',
                borderRadius: '5px',
                marginTop: '20px',
                lineHeight: '1.6',
                minHeight: '300px',
                flexGrow: 1,
                whiteSpace: 'pre-wrap',
              }}
            >
              <p>{post.content}</p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '20px',
              }}
            >
              <button
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  color: '#000000',
                }}
                onClick={() => setShowEditForm(true)}
              >
                수정
              </button>
              <button
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  color: '#000000',
                }}
                onClick={() => setShowPasswordModal(true)}
              >
                삭제
              </button>
            </div>
            {deleteError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                {deleteError}
              </div>
            )}
          </>
        )}
        {showEditForm && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              width: '100%',
              marginTop: '20px',
            }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
                width: '100%',
              }}
              placeholder="제목"
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
                width: '100%',
              }}
              placeholder="작성자"
            />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
                width: '100%',
                height: 'auto',
                minHeight: '200px',
                maxHeight: 'none',
                overflowY: 'hidden',
              }}
              placeholder="내용"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '20px',
              }}
            >
              <button
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  color: '#000000',
                }}
                onClick={handleUpdatePost}
              >
                저장
              </button>
              <button
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  color: '#000000',
                }}
                onClick={() => setShowEditForm(false)}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onConfirm={(password) => {
            setShowPasswordModal(false);
            handleDeletePost(password);
          }}
        />
      )}
    </div>
  );
};

export default PostDetail;
