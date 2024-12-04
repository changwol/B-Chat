import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/ui/Header";
import styles from "./BoardDetailPage.module.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const BoardDetailPage = () => {
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const baseUrl = "http://localhost:8080";
  const location = useLocation();
  const token = localStorage.getItem("Authorization"); // JWT 토큰
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [fetchedData, setFetchedData] = useState(null); // 요청 데이터 상태
  const [comment, setComment] = useState(""); // 댓글 입력 상태

  const goToBoardList = () => {
    navigate("/board");
  };

  const goToUpdatePage = () => {
    navigate(`/boardUpdate`, { state: { boardDetail: fetchedData } });
  };

  const handleDeleteClick = () => {
    setShowModal(true); // 모달 표시
  };

  const handleModalClose = () => {
    setShowModal(false); // 모달 닫기
    setPassword(""); // 비밀번호 초기화
  };

  const handlePasswordSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${baseUrl}/board/content`, {
        headers: {
          Authorization: token,
        },
        data: {
          boardCode: fetchedData.boardCode,
          memberPassword: password, // 비밀번호를 서버로 전달
        },
      });
      console.log("삭제 성공:", response.data);
      alert("게시글이 삭제되었습니다.");
      navigate("/board");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다. 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
      handleModalClose();
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim().length < 2) {
      alert("댓글은 3자 이상부터 등록 가능합니다.");
      setComment(""); // 댓글 내용 초기화
      return; // 댓글이 3자 미만이면 등록하지 않음
    }

    try {
      const response = await axios.post(
        `${baseUrl}/comment/post`, // API URL
        {
          boardCode: fetchedData.boardCode,
          commentContent: comment,
        },
        {
          headers: {
            Authorization: token, // 헤더에 토큰 포함
          },
        }
      );

      if (response.status === 200) {
        alert("댓글 작성 완료");
        setComment(""); // 댓글 입력창 초기화
        window.location.reload();
      }
    } catch (error) {
      console.error("댓글 추가 실패:", error);
      alert("댓글 추가에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/board/content/${location.state.boardDetail.boardCode}`);
        setFetchedData(response.data); // 데이터 상태 업데이트
      } catch (error) {
        console.error("요청 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.state.boardDetail.boardCode]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (!fetchedData) {
    return <p>게시글 정보가 없습니다.</p>;
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{fetchedData.boardTitle}</div>
          <div className={styles.metadata}>
            <span>{fetchedData.memberId}</span>
            <span>{fetchedData.boardPostDate.slice(0, 10)}</span>
            <span>{fetchedData.boardView} 조회수</span>
          </div>
        </div>
        <div className={styles.body}>{fetchedData.boardContent}</div>

        {/* 댓글 섹션 */}
        <div className={styles.commentSection}>
          {fetchedData.commentList && fetchedData.commentList.length > 0 ? (
            fetchedData.commentList.map((comment) => (
              <div key={comment.commentCode} className={styles.comment}>
                <div className={styles.commentContent}>{comment.commentContent}</div>
                <div className={styles.commentInfo}>
                  <span>{comment.memberId}</span>
                  <span>{" " + comment.postDateTime.slice(0, 10) + " " + comment.postDateTime.slice(11, 16)}</span>
                </div>
              </div>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </div>

        {/* 로그인 상태일 때만 댓글 입력창 렌더링 */}
        {token && (
          <div className={styles.commentInputSection}>
            <Form.Control as="textarea" rows={3} placeholder="댓글을 작성하세요" value={comment} onChange={(e) => setComment(e.target.value)} className={styles.commentInput} />
            <Button onClick={handleCommentSubmit} className={styles.commentSubmitButton}>
              댓글 작성
            </Button>
          </div>
        )}

        <div className={styles.buttonSection}>
          <Button variant="outline-dark" onClick={goToBoardList} className={styles.button}>
            목록
          </Button>
          {fetchedData.memberId === localStorage.getItem("memberId") && (
            <div className={styles.extraButtonSection}>
              <Button variant="outline-dark" onClick={goToUpdatePage} className={styles.button}>
                수정
              </Button>
              <Button variant="outline-dark" onClick={handleDeleteClick} className={styles.button}>
                삭제
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>게시글 삭제</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="passwordInput">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            취소
          </Button>
          <Button variant="danger" onClick={handlePasswordSubmit} disabled={loading || !password}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BoardDetailPage;
