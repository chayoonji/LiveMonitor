import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import "./PostDetail.css";
import { useAuth } from "./Context/AuthContext";

const PasswordModal = ({ onClose, onConfirm }) => {
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    onConfirm(password);
    setPassword(""); // 비밀번호 초기화
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2 className="modal-title">비밀번호 확인</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="modal-input"
          placeholder="비밀번호를 입력하세요"
        />
        <div className="modal-buttons">
          <button className="modal-button" onClick={onClose}>
            취소
          </button>
          <button className="modal-button" onClick={handleConfirm}>
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
  const { isAdmin } = useAuth(); // AuthContext에서 isAdmin 상태 가져오기
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/posts/${id}`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setAuthor(response.data.author);
        setUploadedFiles(response.data.files || []);

        // 파일이 없으면 상태를 "진단 전"으로 설정
        if (!response.data.files || response.data.files.length === 0) {
          await axios.put(`http://localhost:3002/posts/${id}/status`, {
            status: "진단 전",
          });
        }
      } catch (error) {
        setError("게시물을 불러오는 중 오류가 발생했습니다.");
        console.error("Error fetching post:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (showEditForm && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [showEditForm]);

  const handleUpdatePost = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);

    try {
      // 게시물 수정 요청
      const response = await axios.put(
        `http://localhost:3002/posts/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 파일이 추가되었는지 확인하고 상태 업데이트
      const newStatus = files.length > 0 ? "진단 완료" : "진단 전";
      await axios.put(`http://localhost:3002/posts/${id}/status`, {
        status: newStatus,
      });

      if (response.status === 200) {
        alert("게시물이 성공적으로 수정되었습니다.");
        setShowEditForm(false);
        navigate(`/post/${id}`); // 수정된 게시물 페이지로 리다이렉트
      } else {
        alert("게시물 수정 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error updating post:", error.message);
      alert("게시물 수정 중 오류가 발생했습니다: " + error.message);
    }
  };

  const handleAddFile = () => {
    setFiles([...files, null]);
  };

  const handleFileChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleDeletePost = async (password) => {
    try {
      const response = await axios.post(
        "http://localhost:3002/posts/check-password",
        {
          postId: id,
          password: password,
        }
      );

      if (response.data.valid) {
        await axios.delete(`http://localhost:3002/posts/${id}`, {
          data: { password: password },
        });

        alert("게시물이 성공적으로 삭제되었습니다.");
        navigate("/", { state: { refresh: true } });
      } else {
        alert("비밀번호가 틀립니다.");
      }
    } catch (error) {
      console.error("Error deleting post:", error.message);
      alert("게시물 삭제 중 오류가 발생했습니다: " + error.message);
    }
  };

  const handleDiagnosisClick = () => {
    navigate(`/diagnosis`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  const isNotice = post.title.startsWith("[공지]");

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        {!showEditForm && (
          <>
            <div className="post-detail-header">
              <div className="post-detail-title-container">
                <FaArrowLeft
                  className="back-button"
                  onClick={() => navigate(-1)}
                />
                <h1 className="post-detail-title">{title}</h1>
              </div>
              <small className="post-detail-author">by {author}</small>
            </div>

            <div className="post-detail-content">
              <p>{content}</p>

              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="attached-files-title">첨부 파일:</h3>
                  {uploadedFiles.map((file, index) => (
                    <div key={index}>
                      <a
                        className="attached-file-link"
                        href={`http://localhost:300/uploads/${file}`}
                        download
                      >
                        {file}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="post-detail-buttons">
              {!isNotice && (
                <>
                  <button
                    className="edit-button"
                    onClick={() => setShowEditForm(true)}
                  >
                    수정
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    삭제
                  </button>
                  <button
                    className="diagnosis-button"
                    onClick={handleDiagnosisClick}
                  >
                    진단 결과 보기
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {showEditForm && (
          <div className="edit-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="edit-title"
              placeholder="제목"
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="edit-author"
              placeholder="작성자"
            />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="edit-content"
              placeholder="내용"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
            {files.map((_, index) => (
              <div key={index} className="file-input-container">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  className="file-input"
                />
                <button
                  type="button"
                  className="remove-file-button"
                  onClick={() => handleRemoveFile(index)}
                >
                  파일 제거
                </button>
              </div>
            ))}
            {isAdmin && (
              <button
                type="button"
                className="add-file-button"
                onClick={handleAddFile}
              >
                파일 추가
              </button>
            )}
            <button
              className="save-button"
              onClick={handleUpdatePost}
            >
              저장
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowEditForm(false)}
            >
              취소
            </button>
          </div>
        )}
      </div>

      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onConfirm={handleDeletePost}
        />
      )}
    </div>
  );
};

export default PostDetail;
