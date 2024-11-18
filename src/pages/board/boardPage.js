import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './BoardPage.module.css';

const BoardPage = () => {
  const baseUrl = 'http://localhost:8080';
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [nowPage, setNowPage] = useState(1);
  const [boardList, setBoardList] = useState([]); // 게시글 목록 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const postButtonHandelr = () => {
    // 간단한 토큰 검증 메서드
    const token = localStorage.getItem('Authorization');
    if (token) {
      // 예: 토큰이 존재하면 통과로 간주
      setIsAuthorized(true);
    } else {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  };

  useEffect(() => {
    // 게시글 목록을 서버에서 불러오는 요청
    setLoading(true);
    axios
      .get(baseUrl + '/board/content/list?page=' + nowPage) // 실제 API URL을 입력하세요.
      .then((response) => {
        setBoardList(response.data.data); // 게시글 목록을 상태에 저장
      })
      .catch((error) => {
        alert('에러가 발생하였습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [nowPage]); // 현재 페이지 값이 변할때마다 실행

  const boardContentDetail = (id) => {
    axios
      .get(`${baseUrl}/board/content/${id}`) // 서버의 상세 정보 API URL
      .then((response) => {
        const boardDetail = response.data;
        console.log(boardDetail); // 데이터를 확인하거나 상태로 관리
        navigate(`/boardDetail/${id}`, { state: { boardDetail } }); // 상세 페이지로 이동하면서 데이터 전달
      })
      .catch((error) => {
        alert('게시글 정보를 불러오는데 실패했습니다.');
        console.error(error);
      });
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        {loading && <p>게시글을 불러오는 중...</p>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.titleColumn}>제목</th>
              <th className={styles.authorColumn}>작성자</th>
              <th className={styles.dateColumn}>날짜</th>
              <th className={styles.viewColumn}>조회수</th>
            </tr>
          </thead>
          <tbody>
            {boardList.map((board, index) => (
              <tr key={index}>
                <td
                  className={styles.titleColumn}
                  onClick={() => {
                    boardContentDetail(board.boardCode);
                  }}
                >
                  {board.boardTitle}
                </td>
                <td className={styles.authorColumn}>{board.boardAuthor}</td>
                <td className={styles.dateColumn}>
                  {board.boardPostDate.slice(0, 10)}
                </td>
                <td className={styles.viewColumn}>{board.boardView}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {isAuthorized ? (
          <Link to="/boardPost">
            <Button variant="outline-dark">글쓰기</Button>
          </Link>
        ) : (
          <Button variant="outline-dark" onClick={postButtonHandelr}>
            글쓰기
          </Button>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
