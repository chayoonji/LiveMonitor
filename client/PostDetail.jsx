import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import "./PostDetail.css";
import { useAuth } from "./Context/AuthContext";

// 백엔드 API URL을 환경 변수에서 가져옴
const API_URL = import.meta.env.VITE_API_URL;

// 비밀번호 모달 컴포넌트
const PasswordModal = ({ onClose, onConfirm }) => {
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    onConfirm(password);
    setPassword(""); // 비밀번호 초기화
  };

  return (
    <div className="main-container">
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
    </div>
  );
};

// 이메일 모달 컴포넌트
const EmailModal = ({ onClose, onSend }) => {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    onSend(email);
    setEmail(""); // 이메일 초기화
  };

  return (
    <div className="main-container">
      <div className="modal-background">
        <div className="modal-content">
          <h2 className="modal-title">이메일 입력</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="modal-input"
            placeholder="이메일을 입력하세요"
          />
          <div className="modal-buttons">
            <button className="modal-button" onClick={onClose}>
              취소
            </button>
            <button className="modal-button" onClick={handleSend}>
              전송
            </button>
          </div>
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
  const { isAdmin } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false); // 이메일 모달 상태 추가
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/${id}`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setAuthor(response.data.author);
        setUploadedFiles(response.data.files || []);

        // 파일이 없으면 상태를 "진단 전"으로 설정
        if (!response.data.files || response.data.files.length === 0) {
          await axios.put(`${API_URL}/posts/${id}/status`, {
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
        `${API_URL}/posts/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 파일이 추가되었는지 확인하고 상태 업데이트
      const newStatus = files.length > 0 ? "진단 완료" : "진단 전";
      await axios.put(`${API_URL}/posts/${id}/status`, {
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
        "${API_URL}/posts/check-password",
        {
          postId: id,
          password: password,
        }
      );

      if (response.data.valid) {
        await axios.delete(`${API_URL}/posts/${id}`, {
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

  const handleSendEmail = async (email) => {
    try {
      await axios.post("${API_URL}/send-email", {
        email,
        postId: id,
      });
      alert("이메일이 성공적으로 전송되었습니다.");
    } catch (error) {
      console.error("Error sending email:", error.message);
      alert("이메일 전송 중 오류가 발생했습니다: " + error.message);
    } finally {
      setShowEmailModal(false); // 이메일 전송 후 모달 닫기
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
    <div className="main-container">
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
                          href={file.downloadUrl}
                          download
                        >
                          {file.filename}
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
                    {/* 진단 상태가 "진단 전"이 아닌 경우에만 진단 결과 보기 버튼을 보여줌 */}
                    {post.status !== "진단 전" && (
                      <button
                        className="diagnosis-button"
                        onClick={handleDiagnosisClick}
                      >
                        진단 결과 보기
                      </button>
                    )}
                    {/* isAdmin이 true일 때만 이메일 전송 버튼 표시 */}
                    {isAdmin && (
                      <button
                        className="send-email-button"
                        onClick={() => setShowEmailModal(true)}
                      >
                        이메일 전송
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {showEditForm && (
            <div className="edit-form">
              <h2>게시물 수정</h2>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="edit-title-input"
              />
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
                className="edit-content-textarea"
              ></textarea>
              {/* 파일 업로드 섹션을 isAdmin이 true일 때만 보여줌 */}
              {isAdmin && (
                <div className="file-upload-section">
                  <h3>파일 업로드</h3>
                  {files.map((file, index) => (
                    <div key={index} className="file-input-container">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, index)}
                      />
                      <button
                        className="remove-file-button"
                        onClick={() => handleRemoveFile(index)}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button className="add-file-button" onClick={handleAddFile}>
                    파일 추가
                  </button>
                </div>
              )}
              <div className="edit-form-buttons">
                <button className="save-button" onClick={handleUpdatePost}>
                  저장
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setShowEditForm(false)}
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 비밀번호 모달 */}
          {showPasswordModal && (
            <PasswordModal
              onClose={() => setShowPasswordModal(false)}
              onConfirm={handleDeletePost}
            />
          )}

          {/* 이메일 모달 */}
          {showEmailModal && (
            <EmailModal
              onClose={() => setShowEmailModal(false)}
              onSend={handleSendEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
