import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import styles from './BoardDetailPage.module.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const BoardDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { boardDetail } = location.state || {};

  const goToBoardList = () => {
    navigate('/board');
  };

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
          <Button
            variant="outline-dark"
            onClick={goToBoardList}
            className={styles.button}
          >
            수정
          </Button>
          <Button
            variant="outline-dark"
            onClick={goToBoardList}
            className={styles.button}
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
