import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import styles from './BoardDetailPage.module.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BoardDetailPage = () => {
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
                onClick={goToBoardList}
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
    </div>
  );
};

export default BoardDetailPage;
