import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./BoardPage.module.css";

const BoardPage = () => {
  const baseUrl = "http://localhost:8080";
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [nowPage, setNowPage] = useState(1);
  const [boardList, setBoardList] = useState([]); // 게시글 목록 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const postButtonHandelr = () => {
    // 간단한 토큰 검증 메서드
    const token = localStorage.getItem("Authorization");
    if (token) {
      // 예: 토큰이 존재하면 통과로 간주
      setIsAuthorized(true);
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  useEffect(() => {
    // 게시글 목록을 서버에서 불러오는 요청
    setLoading(true);
    axios
      .get(baseUrl + "/board/content/list?page=" + nowPage) // 실제 API URL을 입력하세요.
      .then((response) => {
        setBoardList(response.data.data); // 게시글 목록을 상태에 저장
      })
      .catch((error) => {
        alert("에러가 발생하였습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [nowPage]); // isAuthorized 값이 변경될 때마다 실행

  return (
    <div>
      <Header />
      <div className={styles.container}>
        {loading && <p>게시글을 불러오는 중...</p>} {/* 로딩 중일 때 메시지 */}
        <ul>
          {boardList.map((board, index) => (
            <li key={index}>
              <h3>{board.boardTitle}</h3>
              <p>{board.boardContent}</p>
              <p>작성자: {board.boardAuthor}</p>
              <p>조회수: {board.boardView}</p>
            </li>
          ))}
        </ul>
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
