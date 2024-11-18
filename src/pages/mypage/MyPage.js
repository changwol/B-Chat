import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const baseUrl = 'http://localhost:8080';
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
      <div>
        <h1>내 정보</h1>
        {memberData ? (
          <div>
            <p>이름: {memberData.memberId}</p>
            <p>이메일: {memberData.memberEmail}</p>
            <p>전화번호: {memberData.memberTel}</p>
            {/* 필요에 따라 다른 사용자 정보 추가 */}
          </div>
        ) : (
          <p>사용자 정보를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
};

export default MyPage;
