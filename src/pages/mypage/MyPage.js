import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';

const MyPage = () => {
  const baseUrl = 'http://b-link.kro.kr:8080';
  const token = localStorage.getItem('Authorization'); // 로컬 스토리지에서 토큰 가져오기
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState(null); // 사용자 정보 상태

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/member/mypage`, {
          headers: {
            Authorization: token, // Authorization 헤더에 토큰 추가
          },
        });

        if (response.data) {
          setMemberData(response.data); // API에서 받은 데이터로 상태 업데이트
        } else {
          console.error('회원 정보가 없습니다.');
        }
      } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다.', error);
        navigate('/login'); // 로그인 페이지로 리다이렉트
      }
    };

    if (token) {
      fetchUserData(); // 토큰이 있을 경우에만 요청
    } else {
      navigate('/login'); // 토큰이 없으면 로그인 페이지로 리다이렉트
    }
  }, [token, navigate]); // token과 navigate 값이 변경될 때마다 실행

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>내 정보</div>
        {memberData ? (
          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>아이디</span>
              <span className={styles.infoValue}>{memberData.memberId}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>이름</span>
              <span className={styles.infoValue}>{memberData.memberName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>이메일</span>
              <span className={styles.infoValue}>{memberData.memberEmail}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>전화번호</span>
              <span className={styles.infoValue}>{memberData.memberTel}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>학번</span>
              <span className={styles.infoValue}>
                {memberData.memberStudentNumber}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>등록일</span>
              <span className={styles.infoValue}>
                {memberData.memberRegDate}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>생년월일</span>
              <span className={styles.infoValue}>
                {memberData.memberBirthDate}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>성별</span>
              <span className={styles.infoValue}>
                {memberData.memberSex ? '남성' : '여성'}
              </span>
            </div>
          </div>
        ) : (
          <p>사용자 정보를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
};

export default MyPage;
