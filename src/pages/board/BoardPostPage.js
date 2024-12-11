import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Form from "react-bootstrap/Form";
import styles from "./BoardPostPage.module.css";
import Button from "react-bootstrap/Button";
import axios from "axios";

const BoardPostPage = () => {
  const navigate = useNavigate();
  const baseUrl = "http://b-link.kro.kr:8080";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePostSubmit = async () => {
    try {
      const token = localStorage.getItem("Authorization"); // localStorage에서 토큰을 가져옴
      if (token == null) {
        navigate("/login");
      }
      const response = await axios.post(
        baseUrl + "/board/content",
        {
          boardTitle: title,
          boardContent: content,
        },
        {
          headers: {
            Authorization: token, // 헤더에 토큰을 추가
          },
        }
      );
      console.log("글쓰기 요청 성공:", response.data);
      // 성공 시 원하는 동작을 추가합니다. 예: 페이지 이동
      alert("글 작성이 완료되었습니다.");
      navigate("/board");
    } catch (error) {
      console.error("글쓰기 요청 실패:", error);
    }
  };

  return (
    <div>
      <Header></Header>
      <div className={styles.formContainer}>
        <Form className={`${styles.item} w-90`}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>글 제목</Form.Label>
            <Form.Control type="text" placeholder="글 제목을 입력해주세요" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>글 내용</Form.Label>
            <Form.Control as="textarea" rows={20} value={content} onChange={(e) => setContent(e.target.value)} />
          </Form.Group>
          <Button variant="outline-dark" onClick={handlePostSubmit}>
            글 쓰기
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default BoardPostPage;
