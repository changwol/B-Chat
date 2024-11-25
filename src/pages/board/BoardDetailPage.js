import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import styles from './BoardDetailPage.module.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const BoardDetailPage = () => {
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const baseUrl = 'http://localhost:8080';
  const location = useLocation();
  const token = localStorage.getItem('Authorization'); // 주의: 'Authorization' 스펠링 확인
  const navigate = useNavigate();
  const { boardDetail } = location.state || {};
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [fetchedData, setFetchedData] = useState(null); // 요청 데이터 상태 추가

  const goToBoardList = () => {
    navigate('/board');
  };

  const goToUpdatePage = () => {
    navigate(`/boardUpdate`, { state: { boardDetail } }); // 상세 페이지로 이동하면서 데이터 전달);
  };

  const handleDeleteClick = () => {
    setShowModal(true); // 모달 표시
  };

  const handleModalClose = () => {
    setShowModal(false); // 모달 닫기
    setPassword(''); // 비밀번호 초기화
  };

  const handlePasswordSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${baseUrl}/board/content`, {
        headers: {
          Authorization: token,
        },
        data: {
          boardCode: boardDetail.boardCode,
          memberPassword: password, // 비밀번호를 서버로 전달
        },
      });
      console.log('삭제 성공:', response.data);
      alert('게시글이 삭제되었습니다.');
      navigate('/board');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다. 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
      handleModalClose();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/room/memberId`, {
          headers: {
            Authorization: token, // JWT 토큰을 헤더에 추가
          },
        });
        console.log(response.data); // 응답 데이터 확인
        setFetchedData(response.data); // 데이터 상태 업데이트
      } catch (error) {
        console.error('요청 실패:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login'); // 인증 오류 시 로그인 페이지로 이동
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!boardDetail) {
    return <p>게시글 정보가 없습니다.</p>;
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{boardDetail.boardTitle}</div>
          <div className={styles.metadata}>
            <span>{boardDetail.memberId}</span>
            <span>{boardDetail.boardPostDate.slice(0, 10)}</span>
            <span>{boardDetail.boardView} 조회수</span>
          </div>
        </div>
        <div className={styles.body}>{boardDetail.boardContent}</div>
        <div className={styles.buttonSection}>
          <Button
            variant="outline-dark"
            onClick={goToBoardList}
            className={styles.button}
          >
            목록
          </Button>
          {boardDetail.memberId === fetchedData ? (
            <div className={styles.extraButtonSection}>
              <Button
                variant="outline-dark"
                onClick={goToUpdatePage}
                className={styles.button}
              >
                수정
              </Button>
              <Button
                variant="outline-dark"
                onClick={handleDeleteClick}
                className={styles.button}
              >
                삭제
              </Button>
            </div>
          ) : (
            <div></div>
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
              <Form.Control
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // 비밀번호 상태 업데이트
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={handlePasswordSubmit}
            disabled={loading || !password} // 비밀번호 없을 때 비활성화
          >
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BoardDetailPage;
