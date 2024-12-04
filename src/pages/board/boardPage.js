import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination"; // Pagination 컴포넌트 임포트
import styles from "./BoardPage.module.css";

const BoardPage = () => {
  const baseUrl = "http://localhost:8080";
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [nowPage, setNowPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태
  const [boardList, setBoardList] = useState([]); // 게시글 목록 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const postButtonHandelr = () => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      setIsAuthorized(true);
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}/board/content/list?page=${nowPage}`)
      .then((response) => {
        setBoardList(response.data.data); // 게시글 목록 상태에 저장
        setTotalPages(response.data.boardContentCount); // 총 페이지 수 저장 (예: API 응답에서 제공)
      })
      .catch((error) => {
        alert("에러가 발생하였습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [nowPage]);

  const boardContentDetail = (id) => {
    axios
      .get(`${baseUrl}/board/content/${id}`)
      .then((response) => {
        const boardDetail = response.data;
        console.log(boardDetail);
        navigate(`/boardDetail/${id}`, { state: { boardDetail } });
      })
      .catch((error) => {
        alert("게시글 정보를 불러오는데 실패했습니다.");
        console.error(error);
      });
  };

  const handlePageChange = (pageNumber) => {
    setNowPage(pageNumber); // 페이지 번호 변경
  };

  const renderPagination = () => {
    const pages = [];
    const plusCount = totalPages % 20 === 0 ? 0 : 1;
    const pageCount = totalPages / 20 + plusCount;
    for (let i = 1; i <= pageCount; i++) {
      pages.push(
        <Pagination.Item key={i} active={i === nowPage} onClick={() => handlePageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return pages;
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
                <td className={styles.titleColumn} onClick={() => boardContentDetail(board.boardCode)}>
                  {board.boardTitle}
                </td>
                <td className={styles.authorColumn}>{board.boardAuthor}</td>
                <td className={styles.dateColumn}>{board.boardPostDate.slice(0, 10)}</td>
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
          <div className={styles.postButton}>
            <Button variant="outline-dark" onClick={postButtonHandelr}>
              글쓰기
            </Button>
          </div>
        )}

        {/* 페이지네이션 */}
        <Pagination>
          <Pagination.Prev onClick={() => nowPage > 1 && handlePageChange(nowPage - 1)} />
          {renderPagination()}
          <Pagination.Next onClick={() => nowPage < totalPages && handlePageChange(nowPage + 1)} />
        </Pagination>
      </div>
    </div>
  );
};

export default BoardPage;
