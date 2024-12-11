import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Form from 'react-bootstrap/Form';
import styles from './BoardPostPage.module.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const BoardUpdatePage = () => {
  const navigate = useNavigate();
  const baseUrl = 'http://b-link.kro.kr:8080';
  const location = useLocation();
  const { boardDetail } = location.state || {}; // undefined 대비 초기값 설정
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 초기 상태 설정
  useEffect(() => {
    if (boardDetail) {
      setTitle(boardDetail.boardTitle || ''); // title이 없으면 빈 문자열
      setContent(boardDetail.boardContent || ''); // content가 없으면 빈 문자열
    }
  }, [boardDetail]);

  const updateBoard = async () => {
    try {
      const token = localStorage.getItem('Authorization'); // localStorage에서 토큰을 가져옴
      if (token == null) {
        navigate('/login');
      }
      const response = await axios.put(
        baseUrl + '/board/update',
        {
          boardCode: boardDetail.boardCode,
          boardTitle: title,
          boardContent: content,
        },
        {
          headers: {
            Authorization: token, // 헤더에 토큰을 추가
          },
        }
      );
      console.log('글 수정 성공:', response.data);
      // 성공 시 원하는 동작을 추가합니다. 예: 페이지 이동
      alert('글 수정이 완료되었습니다.');
      navigate('/board');
    } catch (error) {
      console.error('글 수정 실패:', error);
    }
  };

  if (!boardDetail) {
    return <p>게시글 데이터를 불러오는 중입니다...</p>;
  }

  return (
    <div>
      <Header></Header>
      <div className={styles.formContainer}>
        <Form className={`${styles.item} w-90`}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>글 제목</Form.Label>
            <Form.Control
              type="text"
              placeholder="글 제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>글 내용</Form.Label>
            <Form.Control
              as="textarea"
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Button variant="outline-dark" onClick={updateBoard}>
            글 수정하기
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default BoardUpdatePage;
